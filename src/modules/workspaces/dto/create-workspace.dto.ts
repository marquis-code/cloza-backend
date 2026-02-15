import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDto {
    @ApiProperty({
        example: 'My Business Workspace',
        description: 'The name of the new workspace',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
