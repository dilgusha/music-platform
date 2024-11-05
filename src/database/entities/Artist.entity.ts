import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { MusicEntity } from './Music.entity';
import { UserEntity } from './User.entity';
import { AlbumEntity } from './Album.entity';
import { forwardRef } from '@nestjs/common';

@Entity('artist')
export class ArtistEntity extends UserEntity {
    // @OneToOne(() => forwardRef(() => UserEntity), (user) => user.artistProfile)
    // user: UserEntity;
    
    @Column({ nullable: true })
    biography: string; 

    @OneToMany(() => MusicEntity, (music) => music.artist)
    musics: MusicEntity[]; 

    @OneToMany(() => AlbumEntity, (album) => album.artist)
    albums: AlbumEntity[]; 

    @Column({ default: false })
    isVerified: boolean; 

    @Column({ nullable: true, type: 'simple-array' })
    topTracks: string[]; 
}
