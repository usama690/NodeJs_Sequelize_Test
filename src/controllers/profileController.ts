import { Request, Response } from 'express';
import Profile from '../models/profile';
import models from '../models';
import { QueryTypes, Sequelize } from 'sequelize'; // Import Sequelize for QueryTypes
import Job from '../models/job';
import Contract from '../models/contract';
import { Op } from 'sequelize';

export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await Profile.findAll();
    return res.status(200).json({
      success: true,
      message: 'successfully get all the profiles',
      result: profiles
    })
  }

  catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }

};

export const depositMoney = async (req: Request | any, res: Response) => {
  const { depositAmount } = req.body; // The amount to be deposited

  if (req.profile.type !== "client") {
    return res.status(404).json({ success: false, message: 'You are not authorized to perform this operation' });
  }


  const clientId = req.profile.id; // The client making the deposit (from the authenticated profile)
  const client = req.profile; // The client making the deposit (from the authenticated profile)

  // Start a transaction to ensure atomicity
  const t = await models.sequelize.transaction();

  try {

    // Fetch the total of unpaid jobs for this client
    const unpaidJobs = await Job.findAll({
      include: [{
        model: Contract,
        where: { ClientId: clientId, status: 'in_progress' },  // Client's active contracts
      }],
      where: { paid: false },  // Only unpaid jobs
      transaction: t,
    });

    // Calculate the total amount to pay for unpaid jobs
    const totalUnpaidAmount = unpaidJobs.reduce((sum, job) => sum + job.price, 0);

    if (totalUnpaidAmount === 0) {
      return res.status(400).json({ success: false, message: 'Client has no unpaid jobs' });
    }

    // Calculate 25% of the total unpaid amount
    const maxDepositAllowed = totalUnpaidAmount * 0.25;

    // Check if the deposit exceeds 25% of the total unpaid jobs amount
    if (depositAmount > maxDepositAllowed) {
      return res.status(400).json({
        success: false,
        message: `Deposit amount exceeds 25% of the total unpaid jobs. Maximum allowed deposit: ${maxDepositAllowed}`,
      });
    }

    // Add the deposit amount to the client's balance
    client.balance += depositAmount;
    await client.save({ transaction: t });

    // Commit the transaction
    await t.commit();

    return res.status(200).json({ success: true, message: 'Deposit successful', newBalance: client.balance });

  } catch (err: any) {
    // Rollback the transaction in case of an error
    await t.rollback();
    return res.status(500).json({ success: false, message: 'Error processing deposit', error: err.message });
  }
};



export const getBestProfession = async (req: Request, res: Response) => {
  const { start, end }: any = req.query;

  // Validate the date range inputs
  if (!start || !end) {
    return res.status(400).json({ success: false, message: 'Start and end dates are required' });
  }

  try {
    // Raw SQL Query to get the profession that earned the most
    const result = await models.sequelize.query(
      `
      SELECT 
        Profiles.profession AS profession, 
        SUM(Jobs.price) AS totalEarnings
      FROM Jobs
      INNER JOIN Contracts ON Jobs.ContractId = Contracts.id
      INNER JOIN Profiles ON Contracts.ContractorId = Profiles.id
      WHERE Jobs.paid = 1
      AND Jobs.paymentDate BETWEEN :start AND :end
      GROUP BY Profiles.profession
      ORDER BY totalEarnings DESC
      LIMIT 1
      `,
      {
        replacements: { start, end }, // Replacements for the date range
        type: QueryTypes.SELECT,
      }
    );

    // Check if any profession was found
    if (!result.length) {
      return res.status(404).json({ success: false, message: 'No professions found within the specified date range' });
    }

    return res.status(200).json({ success: true, message: "successfully get the best profession", result: result[0] }); // Return the profession with the highest earnings

  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error fetching best profession', error: err.message });
  }
};

export const getBestClients = async (req: Request, res: Response) => {
  const { start, end, limit = 2 }: any = req.query; // Default limit to 2 if not provided

  // Validate the date range inputs
  if (!start || !end) {
    return res.status(400).json({ success: false, message: 'Start and end dates are required' });
  }

  try {
    const result = await models.sequelize.query(
      `
      SELECT 
        Profiles.id AS clientId, 
        Profiles.firstName AS firstName, 
        Profiles.lastName AS lastName, 
        SUM(Jobs.price) AS totalPaid
      FROM Jobs
      INNER JOIN Contracts ON Jobs.ContractId = Contracts.id
      INNER JOIN Profiles ON Contracts.ClientId = Profiles.id
      WHERE Jobs.paid = 1
      AND Jobs.paymentDate BETWEEN :start AND :end
      GROUP BY Profiles.id
      ORDER BY totalPaid DESC
      LIMIT :limit
      `,
      {
        replacements: { start, end, limit: parseInt(limit) },
        type: QueryTypes.SELECT,
      }
    );

    // Check if any clients were found
    if (!result.length) {
      return res.status(404).json({ success: false, message: 'No clients found within the specified date range' });
    }

    return res.status(200).json({ success: true, message: "successfully get the best client", result });

  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error fetching best clients', error: err.message });
  }
};