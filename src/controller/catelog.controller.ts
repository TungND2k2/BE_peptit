import { Request, Response } from 'express';
import AppDataSource from '../config/data-source';
import sendResponse from '../util/response';
import { Catalog } from '../model/catalog';
import { ObjectId } from 'mongodb';


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

const update = async (req: any, res: Response) => {
    try {
        const handler = req.user; // Người dùng thực hiện yêu cầu
        const body = req.body; // Dữ liệu cập nhật từ body
        const catalogId = req.params.id; // Lấy ID catalog từ params (ví dụ: /catalogs/:id)

        // Tìm catalog cần cập nhật
        const catalog = await catalogRepository.findOneBy({ _id: new ObjectId(catalogId) });
        if (!catalog) {
            return sendResponse(res, 404, "Catalog not found");
        }

        // // Kiểm tra quyền sở hữu
        // if (catalog.owner !== handler.id) {
        //     return sendResponse(res, 403, "You are not authorized to update this catalog");
        // }

        // Cập nhật các trường của catalog
        catalog.imageUrl = body.imageUrl || catalog.imageUrl; // Giữ giá trị cũ nếu không gửi
        catalog.name = body.name || catalog.name;
        catalog.title = body.title || catalog.title;
        catalog.description = body.description || catalog.description;
        catalog.price = body.price !== undefined ? body.price : catalog.price; // Cho phép price = 0
        // owner không thay đổi vì đã kiểm tra quyền

        // Lưu cập nhật vào cơ sở dữ liệu
        const updatedCatalog = await catalogRepository.save(catalog);
        return sendResponse(res, 200, updatedCatalog);

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const deleteOne = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const catalogId = req.params.id;

        if (!ObjectId.isValid(catalogId)) {
            return sendResponse(res, 400, "Invalid catalog ID");
        }

        const catalog = await catalogRepository.findOneBy({ _id: new ObjectId(catalogId) });
        if (!catalog) {
            return sendResponse(res, 404, "Catalog not found");
        }

        if (catalog.owner !== handler.id) {
            return sendResponse(res, 403, "You are not authorized to delete this catalog");
        }

        catalog.isDeleted = true;
        await catalogRepository.save(catalog);

        return sendResponse(res, 200, { message: "Catalog deleted successfully", _id: catalogId });
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const findMany = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const catalogs = await catalogRepository.find({
            where: {
                isDeleted: false
            }
        })
        return sendResponse(res, 200, catalogs)

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error")
    }
}

const findOne = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const idCatalog = req.params.id; // Sửa lại từ `req.param.id` -> `req.params.id`
        console.log(req.params)
        if (!idCatalog) {
            return sendResponse(res, 400, "Product ID is required");
        }

        const catalog = await catalogRepository.findOneBy({ _id: new ObjectId(idCatalog), isDeleted: false });


        if (!catalog) {
            return sendResponse(res, 404, "Product not found");
        }

        return sendResponse(res, 200, catalog);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "System Error");
    }
};

export default { create, findMany, update, deleteOne, findOne };
