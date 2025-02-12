// routes/routerAmin.ts
import { Router } from 'express';
import { authenticateJWT } from '../util/jwt';
import catelogController from '../controller/catelog.controller';

const routerCatalog = Router();


routerCatalog.post("/", authenticateJWT, catelogController.create);
routerCatalog.get("/", catelogController.findMany);

export default routerCatalog;
