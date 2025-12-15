import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

export class AuthProxyMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthProxyMiddleware.name);

    private proxy = createProxyMiddleware({
        target: process.env.AUTH_SERVICE_URL,
        pathRewrite: {
            '^/auth': '/',
        },
        followRedirects: false,
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production',
        onProxyReq: (proxyReq: any, req: Request, res: Response) => {
            this.logger.log(
                `[${AuthProxyMiddleware.name}]: Proxying ${req.method} request originally made to '${req.originalUrl}' ...`,
            );

            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.write(bodyData);
            }
        },
    } as Options);

    use(req: Request, res: Response, next: NextFunction) {
        this.proxy(req, res, next);
    }
}