// ArtistEntity.ts
import { Entity, Column, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MusicEntity } from './Music.entity';
import { AlbumEntity } from './Album.entity';
import { UserEntity } from './User.entity';

@Entity('artist')
export class ArtistEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column()
    artistName: string
 
    @Column({ nullable: true })
    biography: string;

    @OneToMany(() => MusicEntity, (music) => music.artist)
    musics: MusicEntity[];

    @OneToMany(() => AlbumEntity, (album) => album.artist)
    albums: AlbumEntity[];

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true, type: 'simple-array' })
    topTracks: number[];

    @Column('text', { array: true, nullable: true })
    socialLinks?: string[];

    @Column()
    genre:string
}
