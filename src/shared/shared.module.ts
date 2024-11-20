import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/User.entity';
import { CategoryEntity } from 'src/database/entities/Category.entity';
import { PlaylistEntity } from 'src/database/entities/Playlist.entity';
import { AlbumEntity } from 'src/database/entities/Album.entity';
import { ArtistEntity } from 'src/database/entities/Artist.entity';
import { ImageValidationService } from './services/image-validation.service';
import { GeneralSettingsEntity } from 'src/database/entities/GeneralSettings.entity';
import { MusicEntity } from 'src/database/entities/Music.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, CategoryEntity, PlaylistEntity, AlbumEntity, ArtistEntity, GeneralSettingsEntity,MusicEntity]),
    ],
    providers: [ImageValidationService],
    exports: [ImageValidationService], 
})
export class SharedModule { }
