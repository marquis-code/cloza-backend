import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsEnum, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Platform } from '@prisma/client';

export class PostTargetDto {
    @ApiProperty({
        enum: Platform,
        example: 'INSTAGRAM',
        description: 'The platform to post to',
    })
    @IsEnum(Platform)
    platform: Platform;

    @ApiProperty({
        example: '2026-03-01T12:00:00Z',
        description: 'The scheduled time for the post',
    })
    @IsDateString()
    scheduledFor: string;
}

export class CreatePostDto {
    @ApiProperty({
        example: 'workspace-id-123',
        description: 'The ID of the workspace for the post',
    })
    @IsString()
    workspaceId: string;

    @ApiProperty({
        example: 'Hello, world! This is my first post using Cloza.',
        description: 'The text content of the post',
    })
    @IsString()
    content: string;

    @ApiProperty({
        example: ['https://example.com/media1.jpg'],
        description: 'List of media URLs for the post',
        required: false,
    })
    @IsArray()
    @IsOptional()
    mediaUrls?: string[];

    @ApiProperty({
        type: [PostTargetDto],
        description: 'Target platforms and schedules for the post',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PostTargetDto)
    targets: PostTargetDto[];
}
