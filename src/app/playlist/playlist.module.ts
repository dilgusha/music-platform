import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlaylistEntity } from "src/database/entities/Playlist.entity";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";
import { MusicModule } from "../music/music.module";
import { PlaylistMusicEntity } from "src/database/entities/PlaylistMusic.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PlaylistEntity,PlaylistMusicEntity]), forwardRef(() => MusicModule)],
    controllers: [PlaylistController],
    providers: [PlaylistService],
    exports: [PlaylistService],
})

export class PlaylistModule { }