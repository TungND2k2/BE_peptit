// routes/routerAmin.ts
import { Router } from 'express';
import { authenticateJWT } from '../util/jwt';
import accessoryController from '../controller/accessory.controller';

const routerAccessory = Router();


routerAccessory.post("/", authenticateJWT, accessoryController.create);
routerAccessory.patch("/:id", authenticateJWT, accessoryController.update);
routerAccessory.delete("/:id", authenticateJWT, accessoryController.deleteOne);
routerAccessory.get("/", accessoryController.findMany);
routerAccessory.get("/:id", accessoryController.findOne);

export default routerAccessory;
