import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeRemove, OneToOne } from 'typeorm';
import { rmSync } from 'fs';
import { join } from 'path';
import { UserEntity } from './User.entity';
import { MusicEntity } from './Music.entity';
import { CategoryEntity } from './Category.entity';

@Entity('images')
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: false })
    userId: number;

    // @OneToOne(() => UserEntity, (user) => user.profileImage)
    // user: UserEntity;

    // @ManyToOne(() => MusicEntity, (music) => music.coverImage)
    // musicImage: MusicEntity;


    // @OneToOne(() => CategoryEntity, (category) => category.categoryCoverImage)
    // category: CategoryEntity;


    @BeforeRemove()
    beforeRemove() {
        rmSync(join(__dirname, '../../../uploads', this.filename))
    }

}
