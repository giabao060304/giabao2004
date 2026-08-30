import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../shared/services/prisma.service';
import {
    RoleName,
    RoleNameType,
} from '../../shared/constants/role.constant';

@Injectable()
export class RolesService {
    private userRoleId: number | null = null;

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

    async getUserRoleId(): Promise<number> {
        if (this.userRoleId === null) {
            const role = await this.getRoleByName(RoleName.USER);
            this.userRoleId = role.id;
        }

        return this.userRoleId;
    }
}