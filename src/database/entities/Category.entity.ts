import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { ImageEntity } from "./Image.entity";
import { MusicEntity } from "./Music.entity";

export type CategoryKey = keyof CategoryEntity;

@Entity('category')
export class CategoryEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    categoryName: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => MusicEntity, (musics) => musics.categories)
    @JoinTable()
    musics: MusicEntity[]

    @OneToOne(() => ImageEntity, { eager: true })
    @JoinColumn()
    categoryCoverImage: ImageEntity;

    // @ManyToOne(() => ImageEntity, { nullable: true })
    // @JoinColumn({ name: "categoryCoverImageId" })
    // categoryCoverImage: ImageEntity;


}