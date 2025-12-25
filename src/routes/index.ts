import { Router } from 'express';
import { Controller } from '../enum/controller';
import routerBlog from './blog';
import routerProduct from './product';
import routerAdmin from './admin';
import routerCategory from './category';
import routerCatalog from './catalog';
import routerAccessory from './accessory';
import routerTestimonial from './testimonial';

const router = Router();

router.use(`/${Controller.Admin}`, routerAdmin);
router.use(`/${Controller.Blog}`, routerBlog);
router.use(`/${Controller.Product}`, routerProduct);
router.use(`/${Controller.Category}`, routerCategory);
router.use(`/${Controller.Catalog}`, routerCatalog);
router.use(`/${Controller.Accessory}`, routerAccessory);
router.use(`/${Controller.Testimonial}`, routerTestimonial);
export default router;
