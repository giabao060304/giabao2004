import { Exclude } from 'class-transformer';

export class UserModel {
    id: number;
    email: string;
    name: string;

    @Exclude()
    password: string;

    phoneNumber: string;
    avatar: string | null;

    @Exclude()
    totpSecret: string | null;

    status: string;
    roleId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<UserModel>) {
        Object.assign(this, partial);
    }
}