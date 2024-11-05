import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MusicUploadService {
    async uploadFile(file: Express.Multer.File): Promise<{ filename: string; path: string }> {
        try {
            const filename = `track-${Date.now()}.mp3`;
            const uploadPath = path.join(__dirname, '../../../uploads/audio/', filename);

            await fs.promises.writeFile(uploadPath, file.buffer);

            return {
                filename,
                path: uploadPath,
            };
        } catch (error) {
            console.error('File upload error:', error);
            throw new InternalServerErrorException('Failed to upload file');
        }
    }
}
