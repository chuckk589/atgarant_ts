import { EntityManager } from '@mikro-orm/core';
import { Users } from 'src/mikroorm/entities/Users';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private readonly em;
    constructor(em: EntityManager);
    findAll(): Promise<import("@mikro-orm/core").Loaded<Users, never>[]>;
    findOne(id: number): Promise<import("@mikro-orm/core").Loaded<Users, never>>;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
