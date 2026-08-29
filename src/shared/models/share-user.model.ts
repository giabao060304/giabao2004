export interface SharedUser {
    id: number;
    email: string;
    name: string;
    phoneNumber: string | null;
    avatar: string | null;
    status: string;
    roleId: number;
}