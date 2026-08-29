import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

import { JwtPayload } from '../types/jwt.type';

export const ActiveUser = createParamDecorator(
    (
        data: unknown,
        ctx: ExecutionContext,
    ): JwtPayload => {
        const request = ctx
            .switchToHttp()
            .getRequest();

        return request.user as JwtPayload;
    },
);