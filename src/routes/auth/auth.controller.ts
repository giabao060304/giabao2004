import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';
import { Req } from '@nestjs/common';
import type { Request } from 'express';
import { LoginSchema } from './auth.dto';
import type { LoginDto } from './auth.dto';
import {
    RegisterSchema,
    VerifyOtpSchema,
} from './auth.dto';

import type {
    RegisterDto,
    VerifyOtpDto,
} from './auth.dto';

import { AuthService } from './auth.service';
import { CustomZodValidationPipe } from '../../pipes/custom-zod-validation.pipe';
import { Serialize } from '../../shared/decorators/serialize.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    @Serialize()
    async register(
        @Body(new CustomZodValidationPipe(RegisterSchema))
        body: RegisterDto,
    ) {
        return this.authService.register(body);
    }

    @Post('verify-otp')
    @Serialize()
    async verifyOtp(
        @Body(new CustomZodValidationPipe(VerifyOtpSchema))
        body: VerifyOtpDto,
    ) {
        return this.authService.verifyOtp(body);
    }
    @Post('login')
    @Serialize()
    async login(
        @Body(new CustomZodValidationPipe(LoginSchema))
        body: LoginDto,
        @Req() request: Request,
    ) {
        const userAgent = request.headers['user-agent'] || 'unknown';
        const ip = request.ip || 'unknown';

        return this.authService.login(body, userAgent, ip);
    }
}