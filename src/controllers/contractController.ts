import { Request, Response } from 'express';
import Contract from '../models/contract';

export const getContractById = async (req: Request, res: Response) => {
    try {
        const id = req.params?.id

        if (!id) return res.status(404).json({
            success: false,
            message: 'contract id is required!',
        })

        const contract = await Contract.findByPk(id);
        return res.status(200).json({
            success: true,
            message: 'successfully get the contract',
            result: contract
        })
    }
    catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
};

export const getAllContracts = async (req: Request, res: Response) => {
    try {
        const contracts = await Contract.findAll();
        return res.status(200).json({
            success: true,
            message: 'successfully get all the contracts',
            result: contracts
        })
    }
    catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
};
