import { Request, Response, NextFunction } from 'express';

const sendResponse = (res: Response, statusCode: number, data: any) => {
    res.status(statusCode).json({
        statusCode,
        data,
    });
};

export default sendResponse;