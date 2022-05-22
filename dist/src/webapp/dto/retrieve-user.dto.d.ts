import { Users } from 'src/mikroorm/entities/Users';
export declare class RetrieveWebAppUser {
    constructor(user: Users);
    chatId: string;
    username: string;
    id: number;
    violations: number;
    offers: number;
}
