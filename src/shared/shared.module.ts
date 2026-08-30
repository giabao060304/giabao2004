import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { EmailService } from './services/email.service';
import { TokenService } from './services/token.service';
import { SharedUserRepository } from './repositories/shared-user.repo';

@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],

    providers: [
        PrismaService,
        HashingService,
        EmailService,
        TokenService,
        SharedUserRepository,
    ],

    exports: [
        PrismaService,
        HashingService,
        EmailService,
        TokenService,
        SharedUserRepository,
    ],
})
export class SharedModule { }