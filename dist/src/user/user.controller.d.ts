import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<import("@mikro-orm/core").Loaded<import("../mikroorm/entities/Users").Users, never>[]>;
    findOne(id: string): Promise<import("@mikro-orm/core").Loaded<import("../mikroorm/entities/Users").Users, never>>;
    update(id: string, updateUserDto: UpdateUserDto): string;
}
