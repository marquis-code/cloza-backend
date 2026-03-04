import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePayoutAccountDto {
    @ApiProperty({ example: 'Access Bank' })
    @IsString()
    bankName: string;

    @ApiProperty({ example: '3021' })
    @IsString()
    accountNumber: string;

    @ApiProperty({ example: 'workspace-id-123' })
    @IsString()
    workspaceId: string;
}
