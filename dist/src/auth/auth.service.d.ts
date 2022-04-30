import { EntityManager } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/mikroorm/entities/Users';
export declare class AuthService {
    private readonly jwtService;
    private readonly em;
    constructor(jwtService: JwtService, em: EntityManager);
    validateUser(chatId: string | number, pass: string): Promise<any>;
    login(user: Users): Promise<{
        access_token: string;
    }>;
}
