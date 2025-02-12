import { Request, Response } from 'express';
import AppDataSource from '../config/data-source';
import sendResponse from '../util/response';
import { Category } from '../model/categori.model';


const categoryRepository = AppDataSource.getRepository(Category);

const create = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const body = req.body;
        const category = new Category();
        category.name = body.name;
        category.title = body.title;
        category.owner = handler.id;
        const createCategoryResult = await categoryRepository.save(category);
        return sendResponse(res, 200, createCategoryResult)

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error")
    }
}

const findMany = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const categories = await categoryRepository.find({})
        return sendResponse(res, 200, categories)

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error")
    }
}
export default { create, findMany };
