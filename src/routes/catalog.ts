// routes/routerAmin.ts
import { Router } from 'express';
import { authenticateJWT } from '../util/jwt';
import catelogController from '../controller/catelog.controller';

const routerCatalog = Router();


routerCatalog.post("/", authenticateJWT, catelogController.create);
routerCatalog.get("/:id", catelogController.findOne);
routerCatalog.patch("/:id", authenticateJWT, catelogController.update);
routerCatalog.delete("/:id", authenticateJWT, catelogController.deleteOne);
routerCatalog.get("/", catelogController.findMany);

export default routerCatalog;
