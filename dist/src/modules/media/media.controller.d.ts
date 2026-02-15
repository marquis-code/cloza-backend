import { MediaService } from './media.service';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';
export declare class MediaController {
    private mediaService;
    constructor(mediaService: MediaService);
    getUploadUrl(getUploadUrlDto: GetUploadUrlDto): Promise<{
        uploadUrl: string;
        key: string;
        publicUrl: string;
    }>;
}
