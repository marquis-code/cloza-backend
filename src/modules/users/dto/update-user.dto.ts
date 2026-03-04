import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ example: 'John Doe', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'john@example.com', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: '+2348012345678', required: false })
    @IsPhoneNumber()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @ApiProperty({ example: 'newpassword123', required: false })
    @IsString()
    @IsOptional()
    password?: string;
}
