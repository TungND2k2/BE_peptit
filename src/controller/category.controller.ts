import { Request, Response } from 'express';
import AppDataSource from '../config/data-source';
import sendResponse from '../util/response';
import { Category } from '../model/categori.model';
import { ObjectId } from 'mongodb';


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

const update = async (req: any, res: Response) => {
    try {
        const handler = req.user; // Người dùng thực hiện yêu cầu
        const body = req.body; // Dữ liệu cập nhật từ body
        const categoryId = req.params.id; // Lấy ID category từ params (ví dụ: /categories/:id)

        // Tìm category cần cập nhật
        const category = await categoryRepository.findOneBy({ _id: new ObjectId(categoryId) });
        if (!category) {
            return sendResponse(res, 404, "Category not found");
        }

        // Cập nhật các trường của category
        category.name = body.name || category.name; // Giữ giá trị cũ nếu không gửi
        category.title = body.title || category.title;
        // owner không thay đổi vì đã kiểm tra quyền

        // Lưu cập nhật vào cơ sở dữ liệu
        const updatedCategory = await categoryRepository.save(category);
        return sendResponse(res, 200, updatedCategory);

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const deleteOne = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const categoryId = req.params.id;

        if (!ObjectId.isValid(categoryId)) {
            return sendResponse(res, 400, "Invalid category ID");
        }

        const category = await categoryRepository.findOneBy({ _id: new ObjectId(categoryId) });
        if (!category) {
            return sendResponse(res, 404, "Category not found");
        }

        // if (category.owner !== handler.id) {
        //     return sendResponse(res, 403, "You are not authorized to delete this category");
        // }

        category.isDeleted = true;
        await categoryRepository.save(category);

        return sendResponse(res, 200, { message: "Category deleted successfully", _id: categoryId });
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const findMany = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const categories = await categoryRepository.find({
            where: {
                isDeleted: false
            }
        })
        return sendResponse(res, 200, categories)

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error")
    }
}
export default { create, findMany, update, deleteOne };
