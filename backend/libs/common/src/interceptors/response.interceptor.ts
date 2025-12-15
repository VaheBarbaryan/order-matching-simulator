import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';
import { FastifyReply } from 'fastify';
import { ApiResponse } from '../types'

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const response = context.switchToHttp().getResponse<FastifyReply>();

        return next.handle().pipe(
            map((data: any) => {
                let message = 'Success';

                // If controller returned an object with a 'message' field, use it
                if (data && typeof data === 'object' && 'message' in data) {
                    message = data.message;
                }

                return {
                    success: true,
                    statusCode: response.statusCode,
                    message,
                    data,
                };
            }),
            catchError((error: unknown) => {
                let status = HttpStatus.INTERNAL_SERVER_ERROR;
                let message = 'An error occurred';

                if (error instanceof HttpException) {
                    status = error.getStatus();
                    const res = error.getResponse() as any;
                    message = typeof res === 'string' ? res : res.message || error.message;
                } else if (error instanceof Error) {
                    message = error.message;
                }

                const apiResponse: ApiResponse<T> = {
                    success: false,
                    statusCode: status,
                    message,
                };

                return throwError(() => new HttpException(apiResponse, status));
            }),
        );
    }
}
