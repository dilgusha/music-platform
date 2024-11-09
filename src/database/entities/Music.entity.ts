import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { ImageEntity } from './Image.entity';
import { CategoryEntity } from './Category.entity';
import { PlaylistEntity } from './Playlist.entity';
import { PlaylistMusic } from './PlaylistMusic.entity';
// import { ArtistEntity } from './Artist.entity';
import { AlbumEntity } from './Album.entity';
import { ArtistEntity } from './Artist.entity';

@Entity('music')
export class MusicEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    track: string;

    @Column({ unique: true })
    name: string;

    @Column()
    duration: number;

    @ManyToOne(() => ImageEntity, { eager: true })
    coverImage: ImageEntity;

    @Column({ type: 'date', nullable: true })
    releaseDate: Date;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => CategoryEntity, (category) => category.musics)
    @JoinTable()
    categories: CategoryEntity[];

    // @ManyToMany(() => PlaylistEntity, (playlist) => playlist.musics)
    // playlists: PlaylistEntity[];

    @OneToMany(() => PlaylistMusic, playlistMusic => playlistMusic.music)
    playlistMusics: PlaylistMusic[];

    @ManyToOne(() => ArtistEntity, (artist) => artist.musics)
    artist: ArtistEntity;

    @ManyToOne(() => AlbumEntity, (album) => album.tracks)
    album: AlbumEntity;


    // @Column()
    // url: string;

}
