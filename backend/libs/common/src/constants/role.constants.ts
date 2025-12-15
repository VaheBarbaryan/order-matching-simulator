export const ROLE = {
    ADMIN: 'admin',
    TRADER: 'trader'
} as const;

export type RoleType = (typeof ROLE)[keyof typeof ROLE];
