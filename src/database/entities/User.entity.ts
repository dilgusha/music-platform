import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Gender, UserRoles } from "src/shared/enum/user.enum";
import * as bcrypt from 'bcrypt';
import { ImageEntity } from "./Image.entity";
import { PlaylistEntity } from "./Playlist.entity";
import { FollowEntity } from "./Follow.entity";
import { CommonEntity } from "./Common.entity";

@Entity('user')

export class UserEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    email: string

    @Column()
    birthDate: Date

    @Column()
    password: string;

    
    @Column({ default: 0 })
    followerCount: number;


    @Column({ default: 0 })
    followedCount: number;

    @Column({
        type: 'enum',
        enum: UserRoles,
        array: true
    })
    roles: UserRoles[];

    @BeforeInsert()
    beforeInsert() {
        this.password = bcrypt.hashSync(this.password, 10)
    }
    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.man,
    })
    gender: Gender;


    @OneToOne(() => ImageEntity, { eager: true })
    @JoinColumn()
    profileImage: ImageEntity;
    

    @OneToMany(() => PlaylistEntity, (playlist) => playlist.owner)
    playlists: PlaylistEntity[];


    @OneToMany(() => FollowEntity, (follow) => (follow.followedUser))
    followeds: FollowEntity[]

    @OneToMany(() => FollowEntity, (follow) => (follow.followerUser))
    followers: FollowEntity[]
}