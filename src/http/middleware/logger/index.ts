import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../util/logger';

export const loggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const method = req.method
    const path = req.path
    logger.info(`Request received ${method}-${path}`, { method: req.method, url: req.originalUrl });
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info(`Request processed ${method}-${path} took: ${duration}ms`, { method: req.method, url: req.originalUrl, status: res.statusCode, duration });
    });

    next();
};

