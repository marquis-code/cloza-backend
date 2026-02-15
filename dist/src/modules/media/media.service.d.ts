import { ConfigService } from '@nestjs/config';
export declare class MediaService {
    private configService;
    private s3Client;
    constructor(configService: ConfigService);
    getPresignedUploadUrl(fileName: string, contentType: string, workspaceId: string): Promise<{
        uploadUrl: string;
        key: string;
        publicUrl: string;
    }>;
}
