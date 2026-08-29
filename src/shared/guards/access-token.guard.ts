import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

import { TokenService } from '../services/token.service';
import { JwtPayload } from '../types/jwt.type';

@Injectable()
export class AccessTokenGuard
    implements CanActivate {

    constructor(
        private readonly tokenService: TokenService,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const request =
            context.switchToHttp().getRequest<
                Request & {
                    user?: JwtPayload;
                }
            >();

        const authorization =
            request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException(
                'Access token không tồn tại',
            );
        }

        const [type, token] =
            authorization.split(' ');

        if (
            type !== 'Bearer' ||
            !token
        ) {
            throw new UnauthorizedException(
                'Access token không hợp lệ',
            );
        }

        try {

            const payload =
                await this.tokenService.verifyAccessToken(
                    token,
                );

            request.user = payload;

            return true;

        } catch {

            throw new UnauthorizedException(
                'Access token không hợp lệ hoặc đã hết hạn',
            );
        }
    }
}