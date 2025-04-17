// routes/routerAmin.ts
import { Router } from 'express';
import { authenticateJWT } from '../util/jwt';
import blogController from '../controller/blog.controller';

const routerBlog = Router();


routerBlog.post("/", authenticateJWT, blogController.create);
routerBlog.get("/", blogController.findMany);
routerBlog.get("/:id", blogController.findOne);
routerBlog.patch("/:id", authenticateJWT, blogController.update);
routerBlog.delete("/:id", authenticateJWT, blogController.remove);

export default routerBlog;
