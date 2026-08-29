import { Global, Module } from '@nestjs/common';

import { PrismaService } from './services/prisma.service';

import { HashingService } from './services/hashing.service';

import { SharedUserRepository } from './repositories/shared-user.repo';

@Global()
@Module({
    providers: [
        PrismaService,
        HashingService,
        SharedUserRepository,
    ],

    exports: [
        PrismaService,
        HashingService,
        SharedUserRepository,
    ],
})
export class SharedModule { }