import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PlaylistEntity } from './Playlist.entity';
import { MusicEntity } from './Music.entity';

@Entity('playlist_music')
export class PlaylistMusicEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlaylistEntity, (playlist) => playlist.playlistMusics, { onDelete: 'CASCADE' })
    playlist: PlaylistEntity;

    @ManyToOne(() => MusicEntity, (music) => music.playlistMusics, { onDelete: 'CASCADE' })
    music: MusicEntity;

    @Column()
    order: number; 
}
