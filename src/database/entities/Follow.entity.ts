import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "./User.entity";
import { CommonEntity } from "./Common.entity";
import { FollowStatus } from "src/shared/enum/follow.enum";

@Entity('follow')
export class FollowEntity extends CommonEntity {
    @Column({ default: FollowStatus.NOT_FOLLOWING })
    status: FollowStatus;

    @ManyToOne(() => UserEntity, (user) => (user.followers), { eager: true, onDelete: 'CASCADE' })
    followerUser: UserEntity;


    @ManyToOne(() => UserEntity, (user) => (user.followeds), { eager: true, onDelete: 'CASCADE' })
    followedUser: UserEntity;
}