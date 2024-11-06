import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, JoinColumn } from 'typeorm';
import { PlaylistEntity } from './Playlist.entity';
import { MusicEntity } from './Music.entity';

@Entity({ name: 'playlist_music' })
export class PlaylistMusic {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlaylistEntity, playlist => playlist.playlistMusics, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'playlistId' })
    playlist: PlaylistEntity;

    @ManyToOne(() => MusicEntity, music => music.playlistMusics, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'musicId' })
    music: MusicEntity;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    addedAt: Date;
}
