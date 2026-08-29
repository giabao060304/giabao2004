import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../types/jwt.type';

@Injectable()
export class TokenService {

    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async generateAccessToken(
        payload: JwtPayload,
    ) {
        return this.jwtService.signAsync(
            payload,
            {
                expiresIn: '15m',
            },
        );
    }

    async generateRefreshToken(
        payload: JwtPayload,
    ) {
        return this.jwtService.signAsync(
            payload,
            {
                expiresIn: '7d',
            },
        );
    }

    async verifyAccessToken(
        token: string,
    ): Promise<JwtPayload> {

        return this.jwtService.verifyAsync<JwtPayload>(
            token,
        );
    }

    async verifyRefreshToken(
        token: string,
    ): Promise<JwtPayload> {

        return this.jwtService.verifyAsync<JwtPayload>(
            token,
        );
    }
}