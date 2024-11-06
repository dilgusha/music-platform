import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
// import { ArtistEntity } from './Artist.entity';
import { MusicEntity } from './Music.entity';

@Entity('album')
export class AlbumEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string; 

    @Column({ nullable: true })
    releaseDate: Date; 

    @Column({ nullable: true })
    coverImage: string; 

    // @ManyToOne(() => ArtistEntity, (artist) => artist.albums)
    // artist: ArtistEntity; 

    @OneToMany(() => MusicEntity, (music) => music.album)
    tracks: MusicEntity[];
}
