// routes/routerAmin.ts
import { Router } from 'express';
import adminController from '../controller/admin.controller'; // Đảm bảo đúng đường dẫn
import { authenticateJWT } from '../util/jwt';

const routerAdmin = Router();

routerAdmin.post("/login", adminController.login);

routerAdmin.post("/", adminController.creatAdmin);

export default routerAdmin;
