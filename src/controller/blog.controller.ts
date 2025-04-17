import { Request, Response } from 'express';
import AppDataSource from '../config/data-source';
import { Blog } from '../model/blog.model';
import sendResponse from '../util/response';
import { ObjectId } from 'mongodb';

const blogRepository = AppDataSource.getRepository(Blog);

// Create Blog
const create = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const body = req.body;

        const blog = new Blog();
        blog.content = body.content;
        blog.title = body.title;
        blog.author = handler.email;
        blog.owner = handler.id;
        blog.tags = body.tags || [];
        blog.thumbnailUrl = body.thumbnailUrl || null;
        blog.imageUrls = body.imageUrls || [];
        blog.isPublished = body.isPublished || false;
        blog.publishedAt = blog.isPublished ? new Date() : null;

        const created = await blogRepository.save(blog);
        return sendResponse(res, 200, created);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "System Error");
    }
};

// Update Blog
const update = async (req: any, res: Response) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const blog = await blogRepository.findOne({ where: { id, isDeleted: false } });

        if (!blog) return sendResponse(res, 404, "Blog not found");

        blog.title = body.title ?? blog.title;
        blog.content = body.content ?? blog.content;
        blog.tags = body.tags ?? blog.tags;
        blog.thumbnailUrl = body.thumbnailUrl ?? blog.thumbnailUrl;
        blog.imageUrls = body.imageUrls ?? blog.imageUrls;
        blog.isPublished = body.isPublished ?? blog.isPublished;
        blog.publishedAt = blog.isPublished ? new Date() : blog.publishedAt;

        const updated = await blogRepository.save(blog);
        return sendResponse(res, 200, updated);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "System Error");
    }
};

// Soft Delete Blog
const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const blog = await blogRepository.findOne({ where: { id, isDeleted: false } });

        if (!blog) return sendResponse(res, 404, "Blog not found");

        blog.isDeleted = true;
        await blogRepository.save(blog);
        return sendResponse(res, 200, "Blog deleted successfully");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "System Error");
    }
};

// Find one blog
const findOne = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const blog = await blogRepository.findOne({ where: { _id: new ObjectId(id), isDeleted: false } });

        if (!blog) return sendResponse(res, 404, "Blog not found");
        return sendResponse(res, 200, blog);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "System Error");
    }
};

// Find many blogs
const findMany = async (req: Request, res: Response) => {
    try {
        const blogs = await blogRepository.find({ where: { isDeleted: false }, order: { publishedAt: "DESC" } });
        return sendResponse(res, 200, blogs);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "System Error");
    }
};

export default {
    create,
    update,
    remove,
    findOne,
    findMany,
};
