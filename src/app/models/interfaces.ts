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
    photographer?: string;
    client: string;
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

export interface Paquete{
    id: string;
    name: string;
    description: number;
    duration: number;
    prices: PrecioPaquete[];
}

export interface Contrato{
    id: string;
    fecha: Date;
    fotografo: {
        uid?: string;
        displayName?: string;
        phone?: number;
        address?: string;
        city?: string;
        country?: string;
        photoURL?: string;
    };
    cliente: {
        uid?: string;
        displayName?: string;
        phone?: number;
        address?: string;
        city?: string;
        country?: string;
        photoURL?: string;
    };
    estilo: string;
    locacion: string;
    paquete: Paquete;
    estado: 'Pendiente' | 'Aceptado' | 'Rechazado' | 'Finalizado';
}

export interface EstiloFotografico{
    id: string;
    name: string;
    description: string;
}

export interface PrecioPaquete{
    name: 'Fotógrafo Nivel 1' | 'Fotógrafo Nivel 2' | 'Fotógrafo Nivel 3';
    val: number;
}
