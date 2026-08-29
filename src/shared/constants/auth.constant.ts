export const RoleName = {
    ADMIN: 'ADMIN',
    SELLER: 'SELLER',
    USER: 'USER',
} as const;

export type RoleNameType =
    (typeof RoleName)[keyof typeof RoleName];