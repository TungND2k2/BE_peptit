import { Request, Response } from 'express';
import AppDataSource from '../config/data-source';
import { Blog } from '../model/blog.model';
import sendResponse from '../util/response';


const blogRepository = AppDataSource.getRepository(Blog);

const create = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const body = req.body;
        const blog = new Blog();
        blog.content = body.content;
        blog.title = body.title;
        blog.author = handler.email;
        blog.owner = handler.id;
        const createBlogResult = await blogRepository.save(blog);
        return sendResponse(res, 200, createBlogResult)

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error")
    }
}
export default { create };
