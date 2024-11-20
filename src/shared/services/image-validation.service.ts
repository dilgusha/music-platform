import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { ImageEntity } from 'src/database/entities/Image.entity'; // Fotoğraf tablonuzun entity'si
import { UserEntity } from 'src/database/entities/User.entity';
import { CategoryEntity } from 'src/database/entities/Category.entity';
import { PlaylistEntity } from 'src/database/entities/Playlist.entity';
import { AlbumEntity } from 'src/database/entities/Album.entity';
import { ArtistEntity } from 'src/database/entities/Artist.entity';
import { GeneralSettingsEntity } from 'src/database/entities/GeneralSettings.entity';
import { MusicEntity } from 'src/database/entities/Music.entity';

@Injectable()
export class ImageValidationService {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(CategoryEntity) private categoryRepo: Repository<CategoryEntity>,
        @InjectRepository(PlaylistEntity) private playlistRepo: Repository<PlaylistEntity>,
        @InjectRepository(AlbumEntity) private albumRepo: Repository<AlbumEntity>,
        @InjectRepository(GeneralSettingsEntity) private generalSettingsRepo: Repository<GeneralSettingsEntity>,
        @InjectRepository(MusicEntity) private musicRepo: Repository<MusicEntity>
    ) { }

    async validateImageUsage(imageId: number, excludeEntityId?: number): Promise<void> {
        const isImageUsed =
            (await this.userRepo.findOne({ where: { profileImage: { id: imageId }, id: Not(excludeEntityId) } })) ||
            (await this.categoryRepo.findOne({ where: { categoryCoverImage: { id: imageId } } })) ||
            (await this.playlistRepo.findOne({ where: { coverImage: { id: imageId } } })) ||
            (await this.generalSettingsRepo.findOne({ where: { logo: { id: imageId } } })) ||
            (await this.musicRepo.findOne({ where: { coverImage: { id: imageId } } })) ||
            (await this.albumRepo.findOne({ where: { coverImage: { id: imageId } } }));


        if (isImageUsed) {
            throw new BadRequestException('This image is already used');
        }
    }
}
