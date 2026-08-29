import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class AuthRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                role: true,
            },
        });
    }

    async createUser(data: any) {
        return this.prisma.user.create({
            data,
            include: {
                role: true,
            },
        });
    }
    async updateUserStatus(
        userId: number,
        status: 'ACTIVE' | 'INACTIVE',
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
        type: any,
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

    async createVerificationCode(data: any) {
        return this.prisma.verificationCode.create({
            data,
        });
    }

    async findVerificationCode(
        email: string,
        type: any,
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