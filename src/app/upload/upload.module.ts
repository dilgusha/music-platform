import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageEntity } from "src/database/entities/Image.entity";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";

@Module({
    imports: [TypeOrmModule.forFeature([ImageEntity]),
    MulterModule.register({
        storage: diskStorage({
            destination: join(__dirname, '../../../uploads'),
            filename: function (req, file, cb) {
                cb(null, `${Date.now()} ${extname(file.originalname.toLowerCase())}`);
            }
        })
    }),],
    providers: [UploadService],
    controllers: [UploadController],
    exports: [UploadService],
})

export class UploadModule { }