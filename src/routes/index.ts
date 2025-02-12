import { Router } from 'express';
import { Controller } from '../enum/controller';
import routerBlog from './blog';
import routerProduct from './product';
import routerAdmin from './admin';
import routerCategory from './category';
import routerCatalog from './catalog';

const router = Router();

router.use(`/${Controller.Admin}`, routerAdmin);
router.use(`/${Controller.Blog}`, routerBlog);
router.use(`/${Controller.Product}`, routerProduct);
router.use(`/${Controller.Category}`, routerCategory);
router.use(`/${Controller.Catalog}`, routerCatalog);
export default router;
