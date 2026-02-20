import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class MediaService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY');
    const region = this.configService.get<string>('S3_REGION') || 'us-east-1';
    const endpoint = this.configService.get<string>('S3_ENDPOINT');

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('S3 credentials are not configured');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      endpoint,
      forcePathStyle: true,
    });
  }

  async getPresignedUploadUrl(
    fileName: string,
    contentType: string,
    workspaceId: string,
  ) {
    const key = `workspaces/${workspaceId}/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_BUCKET') as string,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    return {
      uploadUrl: url,
      key: key,
      publicUrl: `${this.configService.get('S3_ENDPOINT')}/${this.configService.get('S3_BUCKET')}/${key}`,
    };
  }
}
