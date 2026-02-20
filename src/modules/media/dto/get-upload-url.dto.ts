import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetUploadUrlDto {
  @ApiProperty({
    example: 'product-image.jpg',
    description: 'The name of the file to be uploaded',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'The MIME type of the file',
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({
    example: 'workspace-id-123',
    description: 'The ID of the workspace for the upload',
  })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;
}
