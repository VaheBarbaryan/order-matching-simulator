import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<FastifyRequest>();
        const res = context.switchToHttp().getResponse<FastifyReply>();
        const { method, url, body } = req;
        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const duration = Date.now() - startTime;
                    const bodyStr = body ? ` | body: ${JSON.stringify(this.sanitizeBody(body))}` : '';
                    this.logger.log(
                        `[HTTP] ${method} ${url} | status: ${res.statusCode} | duration: ${duration}ms${bodyStr}`
                    );
                },
                error: (err) => {
                    const duration = Date.now() - startTime;
                    this.logger.error(
                        `[HTTP] ${method} ${url} | status: ${res.statusCode || 500} | duration: ${duration}ms | error: ${err.message}`
                    );
                },
            }),
        );
    }

    private sanitizeBody(body: any): any {
        if (!body) return body;

        const copy = { ...body };
        const sensitiveFields = ['password', 'token', 'refreshToken', 'secret'];

        Object.keys(copy).forEach((key) => {
            if (sensitiveFields.includes(key)) {
                copy[key] = '[REDACTED]';
            }
        });

        return copy;
    }
}
