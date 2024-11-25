import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlbumEntity } from "src/database/entities/Album.entity";
import { TypeORMError } from "typeorm";
import { AlbumController } from "./album.controller";
import { AlbumService } from "./album.service";
import { UploadModule } from "../upload/upload.module";
import { MusicModule } from "../music/music.module";
import { SharedModule } from "src/shared/shared.module";
import { ArtistModule } from "../artist/artist.module";

@Module({
    imports: [TypeOrmModule.forFeature([AlbumEntity]),UploadModule,MusicModule,SharedModule,ArtistModule],
    controllers: [AlbumController],
    providers: [AlbumService],
    exports: [AlbumService]
})

export class AlbumModule { }