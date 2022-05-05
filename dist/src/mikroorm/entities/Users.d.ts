import { Collection, EventArgs } from '@mikro-orm/core';
import { Arbitraries } from './Arbitraries';
import { Profiles } from './Profiles';
import { Violations } from './Violations';
export declare class Users {
    constructor(payload: any);
    id: number;
    chatId?: string;
    username?: string;
    firstName?: string;
    password?: string;
    locale?: string;
    role?: number;
    acceptedRules?: number;
    createdAt: Date;
    updatedAt: Date;
    arbs: Collection<Arbitraries, unknown>;
    profile: Profiles;
    violations: Collection<Violations, unknown>;
    beforeCreate(args: EventArgs<Users>): Promise<void>;
    comparePassword(password: string): Promise<boolean>;
}
