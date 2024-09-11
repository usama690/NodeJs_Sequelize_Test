import { Request, Response } from 'express';
import Job from '../models/job';
import Contract from '../models/contract';
import Profile from '../models/profile';
import Models from '../models'; // Assuming you have the sequelize instance
import { Op } from 'sequelize';


export const getAllUnpaidJobs = async (req: Request | any, res: Response) => {
    try {
        const { profile } = req; // The authenticated user
        const activeContracts = await Contract.findAll({
            where: {
                status: 'in_progress',
                [Op.or]: [
                    { ClientId: profile.id },    // If the user is a client
                    { ContractorId: profile.id } // If the user is a contractor
                ]
            },
            include: [{
                model: Job,
                where: { paid: false },  // Unpaid jobs only
                required: true,          // Only include contracts that have unpaid jobs
            }],
        })
        if (!activeContracts.length) {
            return res.status(404).json({ success: false, message: 'No unpaid jobs found for active contracts' });
        }
        return res.status(200).json({
            success: true,
            message: 'successfully get all the unpaid jobs of a profile user',
            result: activeContracts
        })
    }

    catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }

};

export const payForJob = async (req: Request | any, res: Response) => {
    const jobId = req.params.id; // The ID of the job to pay for
    const clientId = req.profile.id; // The ID of the client (from the authenticated user)

    // Start a transaction to ensure atomicity
    const t = await Models.sequelize.transaction();

    try {
        // Find the job with the given jobId and include the related contract
        const job: any = await Job.findOne({
            where: { id: jobId, paid: false }, // Only find unpaid jobs
            include: {
                model: Contract,
                where: { ClientId: clientId }, // Ensure the client is the one associated with the contract
            },
        });

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found or already paid' });
        }

        const contract = job.Contract;
        const contractorId = contract.ContractorId; // The contractor's userId

        // Get the client and contractor profiles
        const client = await Profile.findOne({ where: { id: clientId }, transaction: t });
        const contractor = await Profile.findOne({ where: { id: contractorId }, transaction: t });

        if (!client || !contractor) {
            return res.status(404).json({ success: false, message: 'Client or contractor not found' });
        }

        // Check if the client has enough balance to pay for the job
        if (client.balance < job.price) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        // Deduct the job price from the client's balance
        client.balance -= job.price;
        await client.save({ transaction: t });

        // Add the job price to the contractor's balance
        contractor.balance += job.price;
        await contractor.save({ transaction: t });

        // Mark the job as paid
        job.paid = true;
        job.paymentDate = new Date();
        await job.save({ transaction: t });

        // Commit the transaction
        await t.commit();

        return res.status(200).json({ success: true, message: 'Job paid successfully' });

    } catch (err: any) {
        // If any error occurs, rollback the transaction
        await t.rollback();
        return res.status(500).json({ success: false, message: 'Error processing payment', error: err.message });
    }
};


export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.findAll();
        return res.status(200).json({
            success: true,
            message: 'successfully get all the jobs',
            result: jobs
        })
    }

    catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }

};
