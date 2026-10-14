import { Response } from 'express';
import crypto from 'crypto';
import sharp from 'sharp';
import { ObjectId } from 'mongodb';
import AppDataSource from '../config/data-source';
import sendResponse from '../util/response';
import { Media } from '../model/media.model';

const mediaRepository = AppDataSource.getRepository(Media);

const ALLOWED_FORMATS = ['jpeg', 'png', 'webp'];
const MAX_DIMENSION = 1600;

const toUrl = (id: ObjectId | string) => `/media/${id.toString()}`;

const upload = async (req: any, res: Response) => {
    try {
        if (!req.file) {
            return sendResponse(res, 400, "File is required");
        }

        // sharp reads the real header bytes, so a renamed file can't slip through
        const meta = await sharp(req.file.buffer).metadata().catch(() => null);
        if (!meta || !meta.format || !ALLOWED_FORMATS.includes(meta.format)) {
            return sendResponse(res, 400, "Only JPEG, PNG or WebP images are allowed");
        }

        // Re-encode server-side: strips metadata, fixes rotation, caps size
        const { data, info } = await sharp(req.file.buffer)
            .rotate()
            .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer({ resolveWithObject: true });

        const sha256 = crypto.createHash('sha256').update(data).digest('hex');
        const existing = await mediaRepository.findOne({
            where: { sha256, isDeleted: false },
            select: ['_id', 'width', 'height'],
        });
        if (existing) {
            return sendResponse(res, 200, { _id: existing._id, url: toUrl(existing._id), width: existing.width, height: existing.height });
        }

        const media = new Media();
        media.mimeType = 'image/webp';
        media.size = data.length;
        media.width = info.width;
        media.height = info.height;
        media.sha256 = sha256;
        media.data = data;
        media.owner = req.user?.id || "";
        const saved = await mediaRepository.save(media);

        return sendResponse(res, 200, { _id: saved._id, url: toUrl(saved._id), width: saved.width, height: saved.height });
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const findOne = async (req: any, res: Response) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return sendResponse(res, 400, "Invalid media ID");
        }

        const media = await mediaRepository.findOneBy({ _id: new ObjectId(id), isDeleted: false });
        if (!media) {
            return sendResponse(res, 404, "Media not found");
        }

        const etag = `"${media.sha256}"`;
        res.setHeader('ETag', etag);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        if (req.headers['if-none-match'] === etag) {
            res.status(304).end();
            return;
        }

        // The mongodb driver returns a BSON Binary rather than a Buffer
        const raw: any = media.data;
        const buffer = Buffer.isBuffer(raw) ? raw : Buffer.from(raw.buffer);
        res.setHeader('Content-Type', media.mimeType);
        res.setHeader('Content-Length', buffer.length);
        res.status(200).end(buffer);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

export default { upload, findOne };
