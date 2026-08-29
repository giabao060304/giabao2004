import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';

import type { ZodSchema } from 'zod';

@Injectable()
export class CustomZodValidationPipe
    implements PipeTransform {
    constructor(
        private readonly schema: ZodSchema,
    ) { }

    transform(
        value: unknown,
        _metadata: ArgumentMetadata,
    ) {
        const result =
            this.schema.safeParse(value);

        if (!result.success) {
            throw new BadRequestException({
                message: 'Dữ liệu không hợp lệ',
                errors: result.error.issues.map(
                    (issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    }),
                ),
            });
        }

        return result.data;
    }
}