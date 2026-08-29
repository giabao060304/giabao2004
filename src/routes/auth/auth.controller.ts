import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

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

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    async register(
        @Body(
            new CustomZodValidationPipe(
                RegisterSchema,
            ),
        )
        body: RegisterDto,
    ) {
        return this.authService.register(body);
    }

    @Post('verify-otp')
    async verifyOtp(
        @Body(
            new CustomZodValidationPipe(
                VerifyOtpSchema,
            ),
        )
        body: VerifyOtpDto,
    ) {
        return this.authService.verifyOtp(body);
    }
}