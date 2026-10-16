import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../config/data-source';
import sendResponse from '../util/response';
import { ChatChannel, ChatClick } from '../model/chatClick.model';

const chatClickRepository = AppDataSource.getRepository(ChatClick);

const text = (value: unknown, max: number) =>
    typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : undefined;

// The create endpoint is public, so cap how often one client can write
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

const rateLimit = (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || 'unknown';
    const entry = hits.get(key);
    if (!entry || entry.resetAt < now) {
        hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    } else if (++entry.count > MAX_PER_WINDOW) {
        res.status(429).json({ statusCode: 429, data: "Too many requests" });
        return;
    }
    if (hits.size > 10000) {
        for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
    }
    next();
};

const create = async (req: Request, res: Response) => {
    try {
        const body = req.body || {};
        if (!Object.values(ChatChannel).includes(body.channel)) {
            return sendResponse(res, 400, "Invalid channel");
        }
        const page = text(body.page, 300);
        if (!page) {
            return sendResponse(res, 400, "Page is required");
        }

        const click = new ChatClick();
        click.channel = body.channel;
        click.page = page;
        click.item = text(body.item, 200);
        click.referrer = text(body.referrer, 200);
        click.landingPage = text(body.landingPage, 300);
        click.timezone = text(body.timezone, 64);
        click.language = text(body.language, 32);
        click.device = body.device === 'mobile' ? 'mobile' : 'desktop';
        await chatClickRepository.save(click);
        return sendResponse(res, 200, { ok: true });
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

const sinceDays = (req: Request) => {
    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

// Admin report: one page of clicks in the last `days` days, newest first
const findMany = async (req: Request, res: Response) => {
    try {
        const page = Math.max(Math.floor(Number(req.query.page)) || 1, 1);
        const pageSize = Math.min(Math.max(Math.floor(Number(req.query.pageSize)) || 20, 1), 100);
        const [items, total] = await chatClickRepository.findAndCount({
            where: { createdAt: { $gte: sinceDays(req) } } as any,
            order: { createdAt: -1 } as any,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return sendResponse(res, 200, { items, total, page, pageSize });
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

// Admin report: totals and top lists over every click in the range (not just one page)
const summary = async (req: Request, res: Response) => {
    try {
        const top = (key: unknown) => [
            { $group: { _id: key, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ];
        const [result] = await AppDataSource.mongoManager
            .aggregate(ChatClick, [
                { $match: { createdAt: { $gte: sinceDays(req) } } },
                {
                    $facet: {
                        channels: [{ $group: { _id: '$channel', count: { $sum: 1 } } }],
                        mobile: [{ $match: { device: 'mobile' } }, { $count: 'count' }],
                        topPages: top({ $ifNull: ['$item', '$page'] }),
                        topSources: top({ $ifNull: ['$referrer', null] }),
                    },
                },
            ])
            .toArray();

        const byChannel = Object.fromEntries(result.channels.map((c: any) => [c._id, c.count]));
        const whatsapp = byChannel[ChatChannel.WHATSAPP] || 0;
        const messenger = byChannel[ChatChannel.MESSENGER] || 0;
        const toRows = (rows: any[]) => rows.map((r) => ({ label: r._id, count: r.count }));
        return sendResponse(res, 200, {
            total: whatsapp + messenger,
            whatsapp,
            messenger,
            mobile: result.mobile[0]?.count || 0,
            topPages: toRows(result.topPages),
            topSources: toRows(result.topSources),
        });
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "System Error");
    }
};

export default { rateLimit, create, findMany, summary };
