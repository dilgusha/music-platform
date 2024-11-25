import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
// import { ArtistEntity } from './Artist.entity';
import { MusicEntity } from './Music.entity';
import { ArtistEntity } from './Artist.entity';
import { ImageEntity } from './Image.entity';

@Entity('album')
export class AlbumEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    albumName: string; 

    @Column({ type: 'date', nullable: true })
    releaseDate: Date; 

    @OneToOne(() => ImageEntity, { eager: true })
    @JoinColumn()
    coverImage: ImageEntity;

    @ManyToOne(() => ArtistEntity, (artist) => artist.albums)
    artist: ArtistEntity; 

    @OneToMany(() => MusicEntity, (music) => music.album)
    tracks: MusicEntity[];
}
