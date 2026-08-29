import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repo';
import { RolesService } from './roles.service';

import { SharedModule } from '../../shared/shared.module';

@Module({
    imports: [
        SharedModule,
    ],

    controllers: [
        AuthController,
    ],

    providers: [
        AuthService,
        AuthRepository,
        RolesService,
    ],
})
export class AuthModule { }