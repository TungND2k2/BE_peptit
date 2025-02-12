import { Request, Response } from 'express';
import { Admin } from '../model/admin.model';
import AppDataSource from '../config/data-source';
import { createHmac } from 'crypto';
import { generateJWT } from '../util/jwt';
import sendResponse from '../util/response';

const adminRepository = AppDataSource.getRepository(Admin);

const login = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const admin = await adminRepository.findOneBy({
            email: body.email,
            password: await hashPassword(body.password)
        });
        if (!admin) {
            return sendResponse(res, 401, 'Invalid email or password');
        };
        const token = await generateJWT({
            ...admin
        }, "1d");
        const refresh_token = await generateJWT({
            ...admin 
        }, "30d");
        return sendResponse(res, 200, {
            access_token: token,
            refresh_token,
            user: admin
        });
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, "System Error")
    }
};

const creatAdmin = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        if (!body.email || !body.password) {
            return sendResponse(res, 401, 'Email or password invalid');
        };
        const admin = new Admin();
        admin.email = body.email;
        admin.password = await hashPassword(body.password);
        await adminRepository.save(admin);
        return sendResponse(res, 200, admin);

    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, "System Error")
    }
}

const hashPassword = async (password: string) => {
    const salt = 'peptit';
    const hash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    return hash;
};
export default { login, creatAdmin };
