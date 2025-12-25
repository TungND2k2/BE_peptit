import { Request, Response } from 'express';
import AppDataSource from '../config/data-source';
import sendResponse from '../util/response';
import { Testimonial } from '../model/testimonial.model';
import { ObjectId } from 'mongodb';

const testimonialRepository = AppDataSource.getRepository(Testimonial);

const create = async (req: any, res: Response) => {
    try {
        const body = req.body;
        const testimonial = new Testimonial();
        testimonial.imageUrl = body.imageUrl;
        testimonial.customerName = body.customerName;
        testimonial.content = body.content;
        testimonial.rating = body.rating || 5;
        testimonial.createdAt = new Date();
        testimonial.updatedAt = new Date();
        testimonial.isDeleted = false;
        const result = await testimonialRepository.save(testimonial);
        return sendResponse(res, 200, result);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
}

const update = async (req: any, res: Response) => {
    try {
        const body = req.body;
        const testimonialId = req.params.id;
        
        const testimonial = await testimonialRepository.findOneBy({ _id: new ObjectId(testimonialId) });
        if (!testimonial) {
            return sendResponse(res, 404, "Testimonial not found");
        }

        testimonial.imageUrl = body.imageUrl || testimonial.imageUrl;
        testimonial.customerName = body.customerName || testimonial.customerName;
        testimonial.content = body.content || testimonial.content;
        testimonial.rating = body.rating !== undefined ? body.rating : testimonial.rating;
        testimonial.updatedAt = new Date();
        
        const updatedTestimonial = await testimonialRepository.save(testimonial);
        return sendResponse(res, 200, updatedTestimonial);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const deleteOne = async (req: any, res: Response) => {
    try {
        const testimonialId = req.params.id;

        if (!ObjectId.isValid(testimonialId)) {
            return sendResponse(res, 400, "Invalid testimonial ID");
        }

        const testimonial = await testimonialRepository.findOneBy({ _id: new ObjectId(testimonialId) });
        if (!testimonial) {
            return sendResponse(res, 404, "Testimonial not found");
        }

        testimonial.isDeleted = true;
        await testimonialRepository.save(testimonial);
        return sendResponse(res, 200, "Testimonial deleted successfully");
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
}

const getAll = async (req: Request, res: Response) => {
    try {
        const testimonials = await testimonialRepository.find({
            where: { isDeleted: false }
        });
        return sendResponse(res, 200, testimonials);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
}

const getOne = async (req: Request, res: Response) => {
    try {
        const testimonialId = req.params.id;

        if (!ObjectId.isValid(testimonialId)) {
            return sendResponse(res, 400, "Invalid testimonial ID");
        }

        const testimonial = await testimonialRepository.findOneBy({ 
            _id: new ObjectId(testimonialId),
            isDeleted: false 
        });

        if (!testimonial) {
            return sendResponse(res, 404, "Testimonial not found");
        }

        return sendResponse(res, 200, testimonial);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
}

export default {
    create,
    getAll,
    getOne,
    update,
    deleteOne
}
