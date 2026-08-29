import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
    private readonly logger = new Logger(CatchEverythingFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = 500;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const exceptionResponse = exception.getResponse();

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
                    message = data.message ?? message;
                }
            }
        } else if (exception instanceof Error) {
            this.logger.error(exception.message, exception.stack);
        } else {
            this.logger.error(exception);
        }

        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}