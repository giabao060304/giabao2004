import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../shared/services/prisma.service';
import {
    RoleName,
    RoleNameType,
} from './role.constant';

@Injectable()
export class RolesService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getRoleByName(name: RoleNameType) {
        const role = await this.prisma.role.findUnique({
            where: {
                name,
            },
        });

        if (!role) {
            throw new NotFoundException(
                `Role ${name} không tồn tại`,
            );
        }

        return role;
    }

    async getUserRole() {
        return this.getRoleByName(RoleName.USER);
    }
}