// src/types/user.ts
import { Address } from './address';

export type UserRole = 'cliente' | 'vendedor' | 'admin';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    ci: string;
    phone: string;
    email: string;
    address: Address;
    role: UserRole;
}

export interface UserWithPasswordHash extends User {
    passwordHash: string;
}