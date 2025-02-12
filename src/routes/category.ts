// routes/routerAmin.ts
import { Router } from 'express';
import { authenticateJWT } from '../util/jwt';
import categoryController from '../controller/category.controller';

const routerCategory = Router();


routerCategory.post("/", authenticateJWT, categoryController.create);
routerCategory.get("/", categoryController.findMany);

export default routerCategory;
