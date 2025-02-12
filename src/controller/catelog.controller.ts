import { Request, Response } from 'express';
import AppDataSource from '../config/data-source';
import sendResponse from '../util/response';
import { Catalog } from '../model/catalog';


const catalogRepository = AppDataSource.getRepository(Catalog);

const create = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const body = req.body;
        const catalog = new Catalog();
        catalog.imageUrl = body.imageUrl;
        catalog.name = body.name;
        catalog.title = body.title;
        catalog.description = body.description;
        catalog.price = handler.price;
        catalog.owner = handler.id;
        const createCatalogResult = await catalogRepository.save(catalog);
        return sendResponse(res, 200, createCatalogResult)

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error")
    }
}

const findMany = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const catalogs = await catalogRepository.find({})
        return sendResponse(res, 200, catalogs)

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error")
    }
}


export default { create, findMany };
