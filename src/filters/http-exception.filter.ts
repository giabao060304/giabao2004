import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message = 'Request failed';

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if (
            typeof exceptionResponse === 'object' &&
            exceptionResponse !== null
        ) {
            const data = exceptionResponse as {
                message?: string | string[];
            };

            if (Array.isArray(data.message)) {
                message = data.message.join(', ');
            } else {
                message = data.message ?? 'Request failed';
            }
        }

        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}