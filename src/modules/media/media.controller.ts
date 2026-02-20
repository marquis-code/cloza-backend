import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Get a presigned upload URL' })
  @ApiResponse({ status: 201, description: 'Presigned URL generated' })
  async getUploadUrl(@Body() getUploadUrlDto: GetUploadUrlDto) {
    return this.mediaService.getPresignedUploadUrl(
      getUploadUrlDto.fileName,
      getUploadUrlDto.contentType,
      getUploadUrlDto.workspaceId,
    );
  }
}
