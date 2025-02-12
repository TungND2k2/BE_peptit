import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const generateJWT = async (data: any, expiresIn: string) => {
    const secretKey = process.env.JWT_SECRET || 'peptit';
    const options = { expiresIn: expiresIn };

    return jwt.sign(data, secretKey, options);
};

export const authenticateJWT = (req: any, res: Response, next: NextFunction): void => {

    const token = req.header('Authorization')?.split(' ')[1];
    console.log(req.headers);  // Logs all headers to the console
    if (!token) {
        res.status(401).json({ message: 'Token not found' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET || 'peptit', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        req.user = decoded;

        console.log(`------------------------> API Access by User: ${decoded.username} (${decoded.email})`);
        console.log(`User Info:`, {
            email: decoded.email,
            username: decoded.username,
            isActive: decoded.isActive
        });

        next();
    });
};