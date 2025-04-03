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

const update = async (req: any, res: Response) => {
    try {
        const handler = req.user; // Người dùng thực hiện yêu cầu
        console.log(handler)
        const body = req.body; // Dữ liệu cập nhật từ body
        const productId = req.params.id; // Lấy ID sản phẩm từ params (ví dụ: /products/:id)
        console.log(productId)
        // Tìm sản phẩm cần cập nhật
        const product = await productRepository.findOneBy({ _id: new ObjectId(productId) });
        if (!product) {
            return sendResponse(res, 404, "Product not found");
        }

        // Kiểm tra quyền sở hữu (nếu cần)
        // if (product.owner !== handler.id) {
        //     return sendResponse(res, 403, "You are not authorized to update this product");
        // }

        // Cập nhật các trường của sản phẩm
        product.imageUrl = body.imageUrl || product.imageUrl; // Giữ giá trị cũ nếu không gửi
        product.name = body.name || product.name;
        product.title = body.title || product.title;
        product.idCategory = body.idCategory || product.idCategory;
        product.description = body.description || product.description;
        product.stock = body.stock !== undefined ? body.stock : product.stock;
        product.price = body.price !== undefined ? body.price : product.price;
        product.attributes = body.attributes !== undefined ? body.attributes : product.attributes;
        // owner không thay đổi vì đã kiểm tra quyền ở trên

        // Lưu cập nhật vào cơ sở dữ liệu
        const updatedProduct = await productRepository.save(product);
        return sendResponse(res, 200, updatedProduct);

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const deleteOne = async (req: any, res: Response) => {
    try {
        const handler = req.user;
        const productId = req.params.id; // Lấy _id từ params

        // Kiểm tra _id hợp lệ
        if (!ObjectId.isValid(productId)) {
            return sendResponse(res, 400, "Invalid product ID");
        }

        // Tìm sản phẩm
        const product = await productRepository.findOneBy({ _id: new ObjectId(productId) });
        if (!product) {
            return sendResponse(res, 404, "Product not found");
        }

        // Kiểm tra quyền sở hữu
        // if (product.owner !== handler.id) {
        //     return sendResponse(res, 403, "You are not authorized to delete this product");
        // }

        // Xóa mềm: Đặt isDeleted thành true
        product.isDeleted = true;
        await productRepository.save(product);

        // Trả về thông báo thành công
        return sendResponse(res, 200, { message: "Product deleted successfully", _id: productId });
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

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
            },
            where: {
                isDeleted: false
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

        const product = await productRepository.findOneBy({ _id: new ObjectId(idProduct), isDeleted: false });


        if (!product) {
            return sendResponse(res, 404, "Product not found");
        }

        return sendResponse(res, 200, product);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "System Error");
    }
};



export default { create, findMany, findOne, update, deleteOne };
