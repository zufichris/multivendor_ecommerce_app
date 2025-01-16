import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../utils/logger';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    logger.info('Request received', { method: req.method, url: req.originalUrl });
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info('Request processed', { method: req.method, url: req.originalUrl, status: res.statusCode, duration });
    });

    next();
};

