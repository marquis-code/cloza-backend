import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class LinkAccountDto {
  @ApiProperty({
    example: 'workspace-id-123',
    description: 'The ID of the workspace to link the account to',
  })
  @IsString()
  workspaceId: string;

  @ApiProperty({
    example: { platform: 'INSTAGRAM', code: 'auth-code' },
    description: 'Provider-specific data for linking the account',
  })
  @IsObject()
  data: any;
}
