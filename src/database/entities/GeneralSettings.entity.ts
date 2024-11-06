import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { ImageEntity } from './Image.entity';

@Entity('general_settings')
export class GeneralSettingsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ImageEntity, { eager: true })
    @JoinColumn()
    logo: ImageEntity;

    @Column({ nullable: true })
    sitename: string;

    @Column({ type: 'text', nullable: true })
    aboutUs: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    facebookUrl: string;

    @Column({ nullable: true })
    instaUrl: string; 

    @Column({ nullable: true })
    twitterUrl: string;

}



// {
//     "logoId": 1,
//    "sitename": "spotify",
//      "aboutUs": "With Spotify it is easy to find the right music or podcast for every moment  on your phone your computer your tablet and more",
//      "phone": "+994 50 123 45 67",
//      "email": "spotify@gmail.com",
//      "instaUrl": "https://www.instagram.com/spotify",
//      "facebookUrl": "https://www.facebook.com/Spotify",
//      "twitterUrl": "https://x.com/spotify"
//  }