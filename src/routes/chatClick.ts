import { Router } from 'express';
import { authenticateJWT } from '../util/jwt';
import chatClickController from '../controller/chatClick.controller';

const routerChatClick = Router();

routerChatClick.post("/", chatClickController.rateLimit, chatClickController.create);
routerChatClick.get("/", authenticateJWT, chatClickController.findMany);

export default routerChatClick;
