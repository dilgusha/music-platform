import { Body, Controller, Delete, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('upload')
@ApiTags('Upload')
@UseGuards(AuthGuard)
@ApiBearerAuth()


export class UploadController {
    constructor(private uploadService: UploadService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                description: {
                    type: 'string',
                    example: 'Image description',
                },
            },
        },
    })
    uploadImage(
        @Req() req: Request,
        @Body('description') description: string,
        @UploadedFile(
            new ParseFilePipe(
                {
                    validators: [
                        new MaxFileSizeValidator({ maxSize: 10485760 }),
                        new FileTypeValidator({
                            fileType: /image\/(jpg|jpeg|png)$/i,
                        }),
                    ],
                }),)
        file: Express.Multer.File) {
        return this.uploadService.uploadImage(req, file,description)
    }

    @Delete(':id')
    deleteImage(@Param('id') id: number) {
        return this.uploadService.deleteImage(id);
    }
}