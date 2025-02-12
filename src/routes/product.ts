// routes/routerAmin.ts
import { Router } from 'express';
import { authenticateJWT } from '../util/jwt';
import productController from '../controller/product.controller';

const routerProduct = Router();


routerProduct.post("/", authenticateJWT, productController.create);
routerProduct.get("/", productController.findMany);
routerProduct.get("/:id", productController.findOne);

export default routerProduct;
