import { Injectable } from '@nestjs/common';
import { Prisma, VerificationCodeType, UserStatus } from '@prisma/client';

import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class AuthRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }
    async createDevice(data: {
        userId: number;
        userAgent: string;
        ip: string;
    }) {
        return this.prisma.device.create({
            data,
        });
    }

    async createRefreshToken(data: {
        token: string;
        userId: number;
        deviceId: number;
        expiresAt: Date;
    }) {
        return this.prisma.refreshToken.create({
            data,
        });
    }

    async createUser(data: Prisma.UserUncheckedCreateInput) {
        return this.prisma.user.create({
            data,
            include: {
                role: true,
            },
        });
    }

    async updateUserStatus(
        userId: number,
        status: UserStatus,
    ) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                status,
            },
        });
    }

    async deleteVerificationCode(
        email: string,
        type: VerificationCodeType,
    ) {
        return this.prisma.verificationCode.delete({
            where: {
                email_type: {
                    email,
                    type,
                },
            },
        });
    }

    async createVerificationCode(data: Prisma.VerificationCodeCreateInput) {
        return this.prisma.verificationCode.create({
            data,
        });
    }

    async findVerificationCode(
        email: string,
        type: VerificationCodeType,
    ) {
        return this.prisma.verificationCode.findUnique({
            where: {
                email_type: {
                    email,
                    type,
                },
            },
        });

    }
}