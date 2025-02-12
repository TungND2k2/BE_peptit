// routes/routerAmin.ts
import { Router } from 'express';
import { authenticateJWT } from '../util/jwt';
import blogController from '../controller/blog.controller';

const routerBlog = Router();


routerBlog.post("/", authenticateJWT, blogController.create);

export default routerBlog;
