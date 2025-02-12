import { Request, Response } from 'express';
import AppDataSource from '../config/data-source';
import sendResponse from '../util/response';
import { Product } from '../model/product.model';
import { ObjectId } from 'mongodb';


const productRepository = AppDataSource.getRepository(Product);

const create = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const body = req.body;
        const product = new Product();
        product.imageUrl = body.imageUrl;
        product.name = body.name;
        product.title = body.title;
        product.idCategory = body.idCategory;
        product.description = body.description;
        product.stock = handler.stock;
        product.price = handler.price;
        product.owner = handler.id;
        const createBlogResult = await productRepository.save(product);
        return sendResponse(res, 200, createBlogResult)

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error")
    }
}

const findMany = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const pageSize = Number(req.query.pageSize) || 50;
        if (pageSize <= 0) {
            return sendResponse(res, 400, "Invalid page size");
        };
        const products = await productRepository.find({
            take: pageSize,
            order: {
                createdAt: -1
            }
        })
        return sendResponse(res, 200, products)

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error")
    }
}


const findOne = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const idProduct = req.params.id; // Sửa lại từ `req.param.id` -> `req.params.id`
        console.log(req.params)
        if (!idProduct) {
            return sendResponse(res, 400, "Product ID is required");
        }

        const product = await productRepository.findOneBy({ _id: new ObjectId(idProduct) });


        if (!product) {
            return sendResponse(res, 404, "Product not found");
        }

        return sendResponse(res, 200, product);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "System Error");
    }
};



export default { create, findMany, findOne };
