import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { AlbumEntity } from "src/database/entities/Album.entity";
import { UserEntity } from "src/database/entities/User.entity";
import { UserRoles } from "src/shared/enum/user.enum";
import { FindOneParams, FindParams } from "src/shared/types/find.params";
import { Not, Repository } from "typeorm";
import { MusicService } from "../music/music.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { NotFoundError } from "rxjs";
import { UploadService } from "../upload/upload.service";
import { UpdateALbumDto } from "./dto/update-album.dto";
import { ImageValidationService } from "src/shared/services/image-validation.service";
import { ArtistService } from "../artist/artist.service";

@Injectable()

export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private albumRepo: Repository<AlbumEntity>,
        private cls: ClsService,
        private uploadService: UploadService,
        private musicService: MusicService,
        private readonly imageValidationService: ImageValidationService,
        private artistService: ArtistService
    ) { }

    async find(params?: FindParams<AlbumEntity>) {
        const myUser = await this.cls.get<UserEntity>('user')

        if (!myUser.roles.includes(UserRoles.ARTIST)) throw new ForbiddenException('You are not allowed to find this album')

        const { where, select, relations } = params || {};

        return this.albumRepo.find({
            where, select, relations
        })
    }

    async findOne(params?: FindOneParams<AlbumEntity>) {
        const { where, select } = params || {};
        return this.albumRepo.findOne({
            where, select
        })
    }

    async create(params: CreateAlbumDto): Promise<AlbumEntity> {
        const myUser = await this.cls.get<UserEntity>('user')
        if (!myUser) throw new Error('User not found');

        if (!myUser.roles.includes(UserRoles.ARTIST)) throw new ForbiddenException('You are not allowed to create album')

        let artist = await this.artistService.findByUser(myUser);
        if (!artist) throw new NotFoundException('Artist not found');
        if (params.coverImage) {
            await this.imageValidationService.validateImageUsage(params.coverImage);
        }
        const album = this.albumRepo.create({
            albumName: params.albumName,
            releaseDate: params.releaseDate ?? new Date(),
            artist: artist,
        })
        const existAlbum = await this.albumRepo.findOne({ where: { albumName: album.albumName } })
        if (existAlbum) throw new NotFoundException('Album already exists');

        if (params.coverImage) {
            const image = await this.uploadService.findImageById(params.coverImage);
            if (!image) {
                throw new BadRequestException('This image is not available');
            }
            album.coverImage = image;
        }

        return this.albumRepo.save(album);
    }


    async update(id: number, params: UpdateALbumDto): Promise<AlbumEntity> {
        const myUser = await this.cls.get<UserEntity>('user')
        if (!myUser) throw new Error('User not found');

        if (!myUser.roles.includes(UserRoles.ARTIST)) throw new ForbiddenException('You are not allowed to update this album')

        if (params.coverImage) {
            await this.imageValidationService.validateImageUsage(params.coverImage);
        }
        const artist = await this.artistService.findByUser(myUser);
        if (!artist) {
            throw new NotFoundException('Artist not found');
        }

        const album = await this.albumRepo.findOne({
            where: { id, artist: { id: artist.id } },
            relations: ['artist'],
        });


        if (!album) throw new NotFoundException('Album not found');
        const existAlbum = await this.albumRepo.findOne({ where: { albumName: album.albumName, id: Not(id) } })
        if (existAlbum) throw new NotFoundException('Album already exists');

        if (params.coverImage) {
            const image = await this.uploadService.findImageById(params.coverImage);
            if (!image) {
                throw new BadRequestException('Geçersiz kapak resmi ID.');
            }
        }

        // Object.assign(album, params);

        // return await this.albumRepo.save(album);

        try {
            Object.assign(album, params);
            return await this.albumRepo.save(album);
        } catch (err) {
            throw new BadRequestException('Failed to update playlist: ' + err.message);
        }

    }

    async delete(id: number) {
        const myUser = await this.cls.get<UserEntity>('user')
        if (!myUser) throw new Error('User not found');
        if (!myUser.roles.includes(UserRoles.ARTIST)) throw new ForbiddenException('You are not allowed to delete this album')
        let result = await this.albumRepo.delete({ id })
        if (result.affected == 0) {
            throw new NotFoundException('Playlist not found')
        }
        return {
            message: 'Album deleted successfully'
        }
    }


    async addTrack(albumId: number, musicId: number): Promise<AlbumEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) throw new NotFoundException('User not found');
        if (!myUser.roles.includes(UserRoles.ARTIST)) throw new ForbiddenException('You are not allowed to add track to this album');

        const artist = await this.artistService.findByUser(myUser);
        if (!artist) throw new NotFoundException('Artist not found');

        const album = await this.albumRepo.findOne({
            where: { id: albumId, artist: { id: artist.id } },
            relations: ['tracks']
        });

        if (!album) throw new NotFoundException('Album not found');
        const track = await this.musicService.findOne({
            where: { id: musicId },
            relations: ['artist'],
        });

        // const track = await this.musicService.findOne({ where: { id: musicId } })
        if (!track) throw new NotFoundException('Music not found');
        if (!track.artist || track.artist.id !== artist.id) throw new ForbiddenException('You are not allowed to add this track to the album because it does not belong to you.')

        if (album.tracks.find(item => item.id === musicId)) throw new ConflictException('Music is already added to this album');

        album.tracks.push(track);
        return this.albumRepo.save(album);
    }


    async removeTrack(albumId: number, musicId: number): Promise<AlbumEntity> {
        const myUser = await this.cls.get<UserEntity>('user')
        if (!myUser) throw new NotFoundException('User not found');
        if (!myUser.roles.includes(UserRoles.ARTIST)) throw new ForbiddenException('User is not allowed to remove music from this album');

        const artist = await this.artistService.findByUser(myUser);
        if (!artist) throw new NotFoundException('Artist not found');

        const album = await this.albumRepo.findOne({
            where: { id: albumId, artist: { id: artist.id } },
            relations: ['tracks']
        });

        if (!album) throw new NotFoundException('Album not found');

        const track = album.tracks.find(item => item.id === musicId)

        if (!track) throw new NotFoundException('Music not found in this album');

        album.tracks = album.tracks.filter(item => item.id !== musicId)

        return await this.albumRepo.save(album)
    }
}