import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
import { PlaylistMusicEntity } from "src/database/entities/PlaylistMusic.entity";
import { MusicEntity } from "src/database/entities/Music.entity";

@Injectable()

export class PlaylistService {
    constructor(
        @InjectRepository(PlaylistEntity) private playlistRepo: Repository<PlaylistEntity>,
        private musicService: MusicService,
        private cls: ClsService,
        // @InjectRepository(PlaylistMusicEntity)
        // private playlistMusicRepo: Repository<PlaylistMusicEntity>
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

    async addMusicToPlaylist(playlistId: number, musicId: number): Promise<PlaylistEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) {
            throw new UnauthorizedException('User not found');
        }

        const playlist = await this.playlistRepo.findOne({
            where: { id: playlistId, owner: { id: myUser.id } },
            relations: ['musics', 'owner']
        });
        if (!playlist) {
            throw new NotFoundException('Playlist not found or you do not have permission to modify it');
        }

        const music = await this.musicService.findOne({ where: { id: musicId } });
        if (!music) {
            throw new NotFoundException('Music not found');
        }

        if (!playlist.musics) {
            playlist.musics = [];
        }
        playlist.musics.push(music);

        return await this.playlistRepo.save(playlist);
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
            relations: ['musics', 'owner']
        });
    
        if (!playlist) {
            throw new NotFoundException('Playlist not found or you do not have permission to modify it');
        }
    
        if (!playlist.musics || playlist.musics.length === 0) {
            throw new NotFoundException('No music found in the playlist');
        }
    
        const shuffledMusics = this.shuffleArray(playlist.musics);
    
        playlist.musics = shuffledMusics;
    
        return await this.playlistRepo.save(playlist);
    }
    
    private shuffleArray(array: MusicEntity[]): MusicEntity[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Değiştirme
        }
        return array;
    }
    
    // async shufflePlaylistMusics(playlistId: number): Promise<PlaylistEntity> {
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
    
    //     // Playlist'teki müzikleri rastgele sıraya göre almak
    //     const shuffledMusics = await this.playlistRepo
    //         .createQueryBuilder('music')
    //         .innerJoinAndSelect('music.playlists', 'playlist', 'playlist.id = :playlistId', { playlistId })
    //         .orderBy('RANDOM()') // PostgreSQL için rastgele sıralama
    //         .getMany();
    
    //     // Playlist'teki müziklerin sırasını karıştırılmış sıralamaya göre güncellemek
    //     playlist.musics = shuffledMusics;
    
    //     // Güncellenmiş playlist'i kaydetmek
    //     return await this.playlistRepo.save(playlist);
    // }
    

    // async findMusicInPlaylist(playlistId: number) {
    //     // `order` alanına göre sıralı olarak playlistteki şarkıları getir
    //     const playlistMusics = await this.playlistMusicRepo.find({
    //         where: { playlist: { id: playlistId } },
    //         order: { order: 'ASC' },
    //         relations: ['music'],
    //     });

    //     return playlistMusics.map(pm => pm.music);
    // }


    // async updateOrderInPlaylist(playlistId: number, orderedMusicIds: number[]) {
    //     // `orderedMusicIds` sırasına göre playlist içindeki `order` değerlerini güncelle
    //     for (let i = 0; i < orderedMusicIds.length; i++) {
    //         const musicId = orderedMusicIds[i];
    //         await this.playlistMusicRepo.update(
    //             { playlist: { id: playlistId }, music: { id: musicId } },
    //             { order: i + 1 } // 1'den başlayan sıralama 
    //         );
    //         console.log(orderedMusicIds[i]);

    //     }
    //     return { status: true, message: 'Playlist reordered successfully' };

    // }

}