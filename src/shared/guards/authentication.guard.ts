import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import {
    AUTH_TYPE_KEY,
} from '../decorators/auth.decorator';

import {
    AuthType,
} from '../constants/auth.constant';

import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class AuthenticationGuard
    implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly accessTokenGuard: AccessTokenGuard,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const authTypes =
            this.reflector.getAllAndOverride<AuthType[]>(
                AUTH_TYPE_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ],
            );

        // Không có @Auth()
        if (!authTypes) {
            return true;
        }

        // Yêu cầu Access Token
        if (
            authTypes.includes(
                AuthType.AccessToken,
            )
        ) {
            return this.accessTokenGuard.canActivate(
                context,
            );
        }

        throw new UnauthorizedException(
            'Authentication type không được hỗ trợ',
        );
    }
}