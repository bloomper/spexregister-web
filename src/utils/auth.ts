import { type Role } from '@/types/auth';

export const AuthUtils = {
    isAdmin: (roles: Role[]) => roles.includes('ADMIN'),
    isEditor: (roles: Role[]) => roles.includes('EDITOR'),
    isUser: (roles: Role[]) => roles.includes('USER'),
    isAdminOrEditor: (roles: Role[]) => roles.some(r => ['ADMIN', 'EDITOR'].includes(r)),
};
