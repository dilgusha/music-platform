import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm";
import { MusicEntity } from "./Music.entity";
import { ImageEntity } from "./Image.entity";
import { UserEntity } from "./User.entity";
import { PlaylistMusic } from "./PlaylistMusic.entity";

@Entity('playlist')
export class PlaylistEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    playlistName: string;

    @Column({ nullable: true })
    description: string;

    // @Column({ type: 'int' })
    // order: number;

    @OneToOne(() => ImageEntity, { eager: true })
    @JoinColumn()
    coverImage: ImageEntity;

    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
    owner: UserEntity;

    // @ManyToMany(() => MusicEntity, (music) => music.id)
    // @JoinTable()
    // musics: MusicEntity[];

    @OneToMany(() => PlaylistMusic, playlistMusic => playlistMusic.playlist)
    playlistMusics: PlaylistMusic[];
}
