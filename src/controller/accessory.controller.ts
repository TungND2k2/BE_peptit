import { Request, Response } from 'express';
import AppDataSource from '../config/data-source';
import sendResponse from '../util/response';
import { ObjectId } from 'mongodb';
import { Accessory } from '../model/accessory.model';

const accessoryRepository = AppDataSource.getRepository(Accessory);

const create = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const body = req.body;
        const accessory = new Accessory();
        accessory.imageUrl = body.imageUrl;
        accessory.name = body.name;
        accessory.title = body.title;
        accessory.description = body.description;
        accessory.price = body.price;
        accessory.type = body.type; // Loại phụ kiện: Buttons, Thread, Lace
        accessory.material = body.material || null; // Có thể null
        accessory.color = body.color || null; // Có thể null
        accessory.width = body.width || null; // Có thể null
        accessory.owner = handler.id;
        const createAccessoryResult = await accessoryRepository.save(accessory);
        return sendResponse(res, 200, createAccessoryResult);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const update = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const body = req.body;
        const accessoryId = req.params.id;

        // Tìm phụ kiện cần cập nhật
        const accessory = await accessoryRepository.findOneBy({ _id: new ObjectId(accessoryId) });
        if (!accessory) {
            return sendResponse(res, 404, "Accessory not found");
        }

        // // Kiểm tra quyền sở hữu (bỏ comment nếu cần)
        // if (accessory.owner !== handler.id) {
        //     return sendResponse(res, 403, "You are not authorized to update this accessory");
        // }

        // Cập nhật các trường của phụ kiện
        accessory.imageUrl = body.imageUrl || accessory.imageUrl;
        accessory.name = body.name || accessory.name;
        accessory.title = body.title || accessory.title;
        accessory.description = body.description || accessory.description;
        accessory.price = body.price !== undefined ? body.price : accessory.price;
        accessory.type = body.type || accessory.type; // Cập nhật loại phụ kiện
        accessory.material = body.material !== undefined ? body.material : accessory.material;
        accessory.color = body.color !== undefined ? body.color : accessory.color;
        accessory.width = body.width !== undefined ? body.width : accessory.width;

        // Lưu cập nhật vào cơ sở dữ liệu
        const updatedAccessory = await accessoryRepository.save(accessory);
        return sendResponse(res, 200, updatedAccessory);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const deleteOne = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const accessoryId = req.params.id;

        if (!ObjectId.isValid(accessoryId)) {
            return sendResponse(res, 400, "Invalid accessory ID");
        }

        const accessory = await accessoryRepository.findOneBy({ _id: new ObjectId(accessoryId) });
        if (!accessory) {
            return sendResponse(res, 404, "Accessory not found");
        }

        if (accessory.owner !== handler.id) {
            return sendResponse(res, 403, "You are not authorized to delete this accessory");
        }

        accessory.isDeleted = true;
        await accessoryRepository.save(accessory);

        return sendResponse(res, 200, { message: "Accessory deleted successfully", _id: accessoryId });
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const findMany = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const { type } = req.query; // Get 'type' from query parameters (e.g., ?type=button)

        // Build the where clause
        const where: any = {
            isDeleted: false,
        };

        // Add type filter if provided and valid
        if (type && ['button', 'thread', 'lace'].includes(type)) {
            where.type = type;
        } else if (type) {
            // Return error if type is provided but invalid
            return sendResponse(res, 400, "Invalid type. Must be 'button', 'thread', or 'lace'");
        }
        console.log(where);

        // Find accessories with the specified conditions
        const accessories = await accessoryRepository.find({ where });

        return sendResponse(res, 200, accessories);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const findOne = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const accessoryId = req.params.id;

        if (!accessoryId) {
            return sendResponse(res, 400, "Accessory ID is required");
        }

        const accessory = await accessoryRepository.findOneBy({ _id: new ObjectId(accessoryId), isDeleted: false });

        if (!accessory) {
            return sendResponse(res, 404, "Accessory not found");
        }

        return sendResponse(res, 200, accessory);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "System Error");
    }
};

export default { create, findMany, update, deleteOne, findOne };