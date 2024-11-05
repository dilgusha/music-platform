import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MusicEntity } from "src/database/entities/Music.entity";
import { MusicController } from "./music.controller";
import { MusicService } from "./music.service";
import { ImageEntity } from "src/database/entities/Image.entity";
import { CategoryEntity } from "src/database/entities/Category.entity"; 
import { CategoryModule } from "../category/category.module";
import { MusicUploadService } from "./musicUpload.service";
import { UploadModule } from "../upload/upload.module";
import { PlaylistEntity } from "src/database/entities/Playlist.entity";
import { PlaylistModule } from "../playlist/playlist.module";
import { PlaylistMusicEntity } from "src/database/entities/PlaylistMusic.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([MusicEntity, ImageEntity, CategoryEntity,PlaylistEntity,PlaylistMusicEntity]), 
        CategoryModule,
        UploadModule,
        forwardRef(() => PlaylistModule)
    ],
    controllers: [MusicController],
    providers: [MusicService, MusicUploadService],
    exports: [MusicService]
})
export class MusicModule {}
