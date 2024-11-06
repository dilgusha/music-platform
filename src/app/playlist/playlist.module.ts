import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlaylistEntity } from "src/database/entities/Playlist.entity";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";
import { MusicModule } from "../music/music.module";
import { PlaylistMusic } from "src/database/entities/PlaylistMusic.entity";
import { ImageEntity } from "src/database/entities/Image.entity";
import { UploadService } from "../upload/upload.service";
import { UploadModule } from "../upload/upload.module";

@Module({
    imports: [TypeOrmModule.forFeature([PlaylistEntity,PlaylistMusic]), forwardRef(() => MusicModule),UploadModule],
    controllers: [PlaylistController],
    providers: [PlaylistService],
    exports: [PlaylistService],
})

export class PlaylistModule { }