import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        avatarUrl: string | null;
        phoneNumber: string | null;
        emailVerified: boolean;
        deletedAt: Date | null;
    } | null>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        avatarUrl: string | null;
        phoneNumber: string | null;
        emailVerified: boolean;
        deletedAt: Date | null;
    }>;
}
