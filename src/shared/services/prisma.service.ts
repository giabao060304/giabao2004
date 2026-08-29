import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    constructor() {
        const databaseUrl = process.env.DATABASE_URL;

        console.log('DATABASE_URL FROM NEST:', databaseUrl);

        if (!databaseUrl) {
            throw new Error('DATABASE_URL is not defined');
        }

        const adapter = new PrismaPg({
            connectionString: databaseUrl,
        });

        super({
            adapter,
        });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('✅ Prisma connected to PostgreSQL');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}