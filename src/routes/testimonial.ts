import { Router } from 'express';
import { authenticateJWT } from '../util/jwt';
import testimonialController from '../controller/testimonial.controller';

const routerTestimonial = Router();

routerTestimonial.post("/", authenticateJWT, testimonialController.create);
routerTestimonial.patch("/:id", authenticateJWT, testimonialController.update);
routerTestimonial.delete("/:id", authenticateJWT, testimonialController.deleteOne);
routerTestimonial.get("/", testimonialController.getAll);
routerTestimonial.get("/:id", testimonialController.getOne);

export default routerTestimonial;
