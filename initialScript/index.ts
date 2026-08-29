import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { RoleName } from '../src/shared/constants/role.constant';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log('🌱 Starting seed...');

    // =========================
    // 1. Tạo các Role
    // =========================

    const adminRole = await prisma.role.upsert({
        where: {
            name: RoleName.ADMIN,
        },
        update: {},
        create: {
            name: RoleName.ADMIN,
            description: 'Quản trị viên hệ thống',
            isActive: true,
        },
    });

    await prisma.role.upsert({
        where: {
            name: RoleName.SELLER,
        },
        update: {},
        create: {
            name: RoleName.SELLER,
            description: 'Người bán hàng',
            isActive: true,
        },
    });

    await prisma.role.upsert({
        where: {
            name: RoleName.USER,
        },
        update: {},
        create: {
            name: RoleName.USER,
            description: 'Người dùng/khách hàng',
            isActive: true,
        },
    });

    console.log('✅ Roles created');

    // =========================
    // 2. Hash password Admin
    // =========================

    const password = await bcrypt.hash(
        'Admin@123456',
        10,
    );

    // =========================
    // 3. Tạo Admin User
    // =========================

    const admin = await prisma.user.upsert({
        where: {
            email: 'admin@example.com',
        },
        update: {
            roleId: adminRole.id,
        },
        create: {
            email: 'admin@example.com',
            name: 'Administrator',
            password,
            phoneNumber: '0900000000',
            status: 'ACTIVE',
            roleId: adminRole.id,
        },
    });

    console.log('✅ Admin user created');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123456');

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((error) => {
        console.error('❌ Seed failed:');
        console.error(error);

        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });