import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlaylistEntity } from "src/database/entities/Playlist.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { ClsService } from "nestjs-cls";
import { UserEntity } from "src/database/entities/User.entity";
import { UpdatePlaylistDto } from "./dto/update-playlist.dto";
import { MusicService } from "../music/music.service";
import { FindParams } from "src/shared/types/find.params";
import { MusicEntity } from "src/database/entities/Music.entity";
import { PlaylistMusic } from "src/database/entities/PlaylistMusic.entity";
import { ImageEntity } from "src/database/entities/Image.entity";
import { UploadService } from "../upload/upload.service";

@Injectable()

export class PlaylistService {
    constructor(
        @InjectRepository(PlaylistEntity) private playlistRepo: Repository<PlaylistEntity>,
        private musicService: MusicService,
        private cls: ClsService,
        @InjectRepository(PlaylistMusic)
        private readonly playlistMusicRepo: Repository<PlaylistMusic>,
        private uploadService: UploadService
    ) { }
    async create(params: CreatePlaylistDto): Promise<PlaylistEntity> {
        const myUser = await this.cls.get<UserEntity>('user')
        if (!myUser) {
            throw new Error('User not found');
        }

        const playlist = this.playlistRepo.create({
            playlistName: params.playlistName,
            owner: myUser,
        });

        return this.playlistRepo.save(playlist);
    }

    async myPlaylist(params: FindParams<PlaylistEntity>) {
        const { where, select, order, limit, page, relations } = params
        const playlists = await this.playlistRepo.find({
            where, select, order, relations, take: limit, skip: limit * page || 0
        })
        if (!playlists || playlists.length === 0) {
            throw new NotFoundException('Playlist not found')
        }

        return playlists;
    }


    async findOnePlaylist(id: number, params: FindParams<PlaylistEntity>) {
        const { where, select, relations } = params

        const playlist = await this.playlistRepo.findOne({
            where: { id },
            select,
            relations: ['musics']
        });
        if (!playlist) {
            throw new NotFoundException('This playlist not found')
        }

        return playlist

    }

    async update(id: number, params: UpdatePlaylistDto): Promise<PlaylistEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) { throw new UnauthorizedException('User not found') }
        const playlist = await this.playlistRepo.findOne({
            where: {
                id,
                owner: { id: myUser.id }
            },
            relations: ['owner']
        });

        if (!playlist) {
            throw new NotFoundException('Playlist not found or you do not have permission to update it');
        }

        if (params.coverImage) {
            const image = await this.uploadService.findImageById( params.coverImage );
            if (!image) {
                throw new BadRequestException('Invalid cover image ID');
            }
        }

        try {
            Object.assign(playlist, params);
            return await this.playlistRepo.save(playlist);
        } catch (err) {
            throw new BadRequestException('Failed to update playlist: ' + err.message);
        }
    }


    async delete(id: number) {
        let result = await this.playlistRepo.delete({ id })
        if (result.affected == 0) {
            throw new NotFoundException('Playlist not found')
        }
        return {
            message: 'Playlist deleted successfully'
        }
    }

    // async addMusicToPlaylist(playlistId: number, musicId: number): Promise<PlaylistEntity> {
    //     const myUser = await this.cls.get<UserEntity>('user');
    //     if (!myUser) {
    //         throw new UnauthorizedException('User not found');
    //     }

    //     const playlist = await this.playlistRepo.findOne({
    //         where: { id: playlistId, owner: { id: myUser.id } },
    //         relations: ['musics', 'owner']
    //     });
    //     if (!playlist) {
    //         throw new NotFoundException('Playlist not found or you do not have permission to modify it');
    //     }

    //     const music = await this.musicService.findOne({ where: { id: musicId } });
    //     if (!music) {
    //         throw new NotFoundException('Music not found');
    //     }

    //     if (!playlist.musics) {
    //         playlist.musics = [];
    //     }
    //     playlist.musics.push(music);

    //     return await this.playlistRepo.save(playlist);
    // }

    async addMusicToPlaylist(playlistId: number, musicId: number): Promise<PlaylistEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) {
            throw new UnauthorizedException('User not found');
        }

        const playlist = await this.playlistRepo.findOne({
            where: { id: playlistId, owner: { id: myUser.id } },
            relations: ['playlistMusics', 'owner']
        });
        if (!playlist) {
            throw new NotFoundException('Playlist not found or you do not have permission to modify it');
        }

        const music = await this.musicService.findOne({ where: { id: musicId } });
        if (!music) {
            throw new NotFoundException('Music not found');
        }

        // const existingEntry = await this.playlistMusicRepo.findOne({
        //     where: { playlist: { id: playlistId }, music: { id: musicId } }
        // });

        // if (existingEntry) {
        //     throw new ConflictException('Music is already in the playlist');
        // }

        const playlistMusic = new PlaylistMusic();
        playlistMusic.playlist = playlist;
        playlistMusic.music = music;

        await this.playlistMusicRepo.save(playlistMusic);

        return await this.playlistRepo.findOne({
            where: { id: playlistId },
            relations: ['playlistMusics', 'playlistMusics.music', 'owner']
        });
    }


    async removeMusicFromPlaylist(playlistId: number, musicId: number): Promise<PlaylistEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) throw new UnauthorizedException('User not found');

        const playlist = await this.playlistRepo.findOne({
            where: { id: playlistId, owner: { id: myUser.id } },
            relations: ['musics', 'owner']
        });
        if (!playlist) throw new NotFoundException('Playlist not found or you do not have permission to modify it');

        const music = await this.musicService.findOne({ where: { id: musicId } });
        if (!music) throw new NotFoundException('Music not found');

        await this.playlistRepo
            .createQueryBuilder()
            .relation(PlaylistEntity, 'musics')
            .of(playlist)
            .remove(music);

        return await this.playlistRepo.findOne({
            where: { id: playlistId },
            relations: ['musics', 'owner']
        });
    }

    async shufflePlaylistMusics(playlistId: number): Promise<PlaylistEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) {
            throw new UnauthorizedException('User not found');
        }
        const playlist = await this.playlistRepo.findOne({
            where: { id: playlistId, owner: { id: myUser.id } },
            relations: ['playlistMusics', 'playlistMusics.music', 'owner']
        });

        if (!playlist) throw new NotFoundException('Playlist not found or you do not have permission to modify it');

        if (!playlist.playlistMusics || playlist.playlistMusics.length === 0) {
            throw new NotFoundException('No music found in the playlist');
        }

        const shuffledPlaylistMusics = this.shuffleArray(playlist.playlistMusics);

        shuffledPlaylistMusics.forEach((playlistMusic, index) => {
            playlistMusic.order = index;
        });

        await this.playlistMusicRepo.save(shuffledPlaylistMusics);

        return await this.playlistRepo.findOne({
            where: { id: playlistId },
            relations: ['playlistMusics']
            // , 'playlistMusics.music', 'owner'
        });
    }

    private shuffleArray(array: PlaylistMusic[]): PlaylistMusic[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }



    // Asagidakilar eyni seydi prosta biri queryBuilderdi

    // async sortPlaylist(playlistId: number) {
    //     const playlist = await this.playlistRepo.createQueryBuilder('playlist')
    //         .leftJoinAndSelect('playlist.playlistMusics', 'playlistMusics')
    //         .leftJoinAndSelect('playlistMusics.music', 'music')
    //         .where('playlist.id = :playlistId', { playlistId })
    //         .orderBy('playlistMusics.addedAt', 'ASC')
    //         .getOne();

    //     if (!playlist) {
    //         throw new NotFoundException('Playlist bulunamadı');
    //     }

    //     return playlist.playlistMusics.map(pm => pm.music);
    // }


    async sortPlaylistByAddedTime(playlistId: number): Promise<PlaylistEntity> {
        const playlist = await this.playlistRepo.findOne({
            where: { id: playlistId },
            relations: ['playlistMusics', 'playlistMusics.music'],
            order: { playlistMusics: { addedAt: 'ASC' } }
        });

        if (!playlist) throw new NotFoundException('Playlist not found');

        return playlist;
    }


}