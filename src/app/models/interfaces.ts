export type Roles = 'PHOTOGRAPHER' | 'CLIENT' | 'ADMIN';

export interface User{
    uid?: string;
    email?: string;
    password?: string;
    displayName?: string;
    role?: Roles;
    emailVerified?: boolean;
    firstLogin?: boolean;
    createdAt?: Date;

    phone?: number;
    address?: string;
    city?: string;
    country?: string;
    photoURL?: string;
    coverPage?: string;
    website?: string;
    biography?: string;
    social?: Social;
    experience?: string;
    location?: string;
    studies?: string;
    photoStyle?: any[];
}

export interface Photo {
    id?: string;
    img?: string;
    downloadURL?: string;
    createdBy?: string;
    createdAt?: Date;
    location?: string;
    likes?: number;
    comments?: string[];
    visualizations?: number;
}

export interface Collection{
    id: string;
    uid?: string;
    name: string;
    date: Date;
    description?: string;
    tag?: string[];
    photos: string[];
}

export interface Social{
    facebook?: string;
    twitter?: string;
    instagram?: string;
    whatsapp?: string;
}
