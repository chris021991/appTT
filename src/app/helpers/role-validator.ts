import { User } from '../../app/models/interfaces';

export class RoleValidator {
    isPhotographer(user: User): boolean{
        return user.role === 'PHOTOGRAPHER';
    }

    isClient(user: User): boolean{
        return user.role === 'CLIENT';
    }

    isAdmin(user: User): boolean{
        return user.role === 'ADMIN';
    }
}
