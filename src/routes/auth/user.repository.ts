import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class UserRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                role: true,
            },
        });
    }

    async findById(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                role: true,
            },
        });
    }

    async create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data,
            include: {
                role: true,
            },
        });
    }

    async update(
        id: number,
        data: Prisma.UserUpdateInput,
    ) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data,
            include: {
                role: true,
            },
        });
    }
}