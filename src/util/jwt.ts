import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in production');
}
const JWT_SECRET = process.env.JWT_SECRET || 'peptit';

export const generateJWT = async (data: any, expiresIn: string) => {
    const secretKey = JWT_SECRET;
    const options = { expiresIn: expiresIn };

    return jwt.sign(data, secretKey, options);
};

export const authenticateJWT = (req: any, res: Response, next: NextFunction): void => {

    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token not found' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
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