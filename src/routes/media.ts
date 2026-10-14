import { Router } from 'express';
import multer from 'multer';
import { authenticateJWT } from '../util/jwt';
import mediaController from '../controller/media.controller';

const uploadFile = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
}).single('file');

const routerMedia = Router();

routerMedia.post("/", authenticateJWT, (req, res, next) => {
    uploadFile(req, res, (err: any) => {
        if (err) {
            const message = err.code === 'LIMIT_FILE_SIZE' ? "File too large (max 5 MB)" : "Upload failed";
            res.status(400).json({ statusCode: 400, data: message });
            return;
        }
        next();
    });
}, mediaController.upload);
routerMedia.get("/:id", mediaController.findOne);

export default routerMedia;
