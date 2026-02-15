import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'The email of the user',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'The password of the user (min 6 characters)',
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'The full name of the user',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
