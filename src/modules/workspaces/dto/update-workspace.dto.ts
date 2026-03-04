import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateWorkspaceDto {
    @ApiProperty({ example: 'Daniel\'s Fashion Store', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Fashion & Apparel', required: false })
    @IsString()
    @IsOptional()
    businessCategory?: string;

    @ApiProperty({ example: 'Lagos, Nigeria', required: false })
    @IsString()
    @IsOptional()
    businessLocation?: string;

    @ApiProperty({ example: 'NGN', required: false })
    @IsString()
    @IsOptional()
    defaultCurrency?: string;

    @ApiProperty({ example: 'Thank you for your payment. Your order will be processed shortly.', required: false })
    @IsString()
    @IsOptional()
    paymentConfirmationMessage?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    followUpReminders?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    newBuyerAlerts?: boolean;
}
