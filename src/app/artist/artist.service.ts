import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ArtistEntity } from "src/database/entities/Artist.entity";
import { UserEntity } from "src/database/entities/User.entity";
import { ClsService } from "nestjs-cls";
import { UserRoles } from "src/shared/enum/user.enum";
import { ApplyForArtistDto } from "./dto/apply-artist.dto";
import { UpdateArtistDto } from "./dto/update-artist.dto";
@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(ArtistEntity)
        private artistRepo: Repository<ArtistEntity>,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private cls: ClsService
    ) { }


    async findById(artistId: number): Promise<ArtistEntity | null> {
        return await this.artistRepo.findOne({
            where: { id: artistId },
            relations: ['user'],
        });
    }
    async findByUser(user: UserEntity): Promise<ArtistEntity | null> {
        return this.artistRepo.findOne({
            where: { user: { id: user.id } },
            relations: ['user'],
        });
    }

    async create(data: { user: UserEntity }): Promise<ArtistEntity> {
        const artist = this.artistRepo.create(data);
        return this.artistRepo.save(artist);
    }

    async save(artist: ArtistEntity): Promise<ArtistEntity> {
        return await this.artistRepo.save(artist);
    }

    async findPending(): Promise<ArtistEntity[]> {
        return await this.artistRepo.find({
            where: { isVerified: false },
            relations: ['user'],
        });
    }

    async getMyArtistProfile(): Promise<ArtistEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) throw new ForbiddenException('User not found');

        const artist = await this.findByUser(myUser);
        if (!artist) throw new NotFoundException('Artist profile not found');

        return artist;
    }


    async applyForArtist(dto: ApplyForArtistDto): Promise<ArtistEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) throw new ForbiddenException('User not found');

        if (!myUser.roles.includes(UserRoles.USER)) {
            throw new UnauthorizedException('You are not eligible to apply for an artist profile');
        }

        try {
            const artist = await this.artistRepo.createQueryBuilder()
                .insert()
                .into(ArtistEntity)
                .values({
                    artistName: dto.artistName,
                    biography: dto.biography || null,
                    // topTracks: dto.topTracks,
                    socialLinks: dto.socialLinks || null,
                    genre: dto.genre || 'Unknown',
                    user: { id: myUser.id },
                    isVerified: false,
                })
                .execute();

            return this.artistRepo.createQueryBuilder('artist')
                .where('artist.id = :id', { id: artist.identifiers[0].id })
                .leftJoinAndSelect('artist.user', 'user')
                .getOne();
        } catch (error) {
            console.error('Error saving artist:', error);
            throw new Error('Failed to save artist');
        }
    }

    async updateArtistDetails(params: UpdateArtistDto): Promise<ArtistEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) throw new ForbiddenException('User not found');

        const artist = await this.findByUser(myUser);
        if (!artist) throw new NotFoundException('Artist profile not found');

        Object.assign(artist, params);
        return await this.save(artist);

        // if (params.topTracks) {
        //     const existingTracks = artist.topTracks || [];
        //     artist.topTracks = Array.from(new Set([...existingTracks, ...params.topTracks]));
        // }
        // const { topTracks, ...otherParams } = params;
        // Object.assign(artist, otherParams);
        // return await this.save(artist)
    }





    // async applyForArtist(dto: ApplyForArtistDto): Promise<ArtistEntity> {
    //     const myUser = await this.cls.get<UserEntity>('user')
    //     if (!myUser) throw new ForbiddenException('User not found')
    //     console.log('User:', myUser);
    //     console.log('User Roles:', myUser?.roles);

    //     if (!myUser || !Array.isArray(myUser.roles) || !myUser.roles.includes(UserRoles.USER)) {
    //         throw new UnauthorizedException('You are not eligible to apply for an artist profile');
    //     }

    //     const artist = new ArtistEntity();
    //     artist.user = myUser;
    //     artist.biography = dto.biography;
    //     // artist.topTracks = dto.topTracks;
    //     artist.isVerified = false;

    //     try {
    //         return await this.artistRepo.save(artist);
    //     } catch (error) {
    //         console.error('Error saving artist:', error);
    //         throw new Error('Failed to save artist');
    //     }
    // }



    // Kocuruldu admin service-e

    // async verifyArtist(artistId: number): Promise<ArtistEntity> {
    //     const artist = await this.artistRepo.findOne({
    //         where: { id: artistId },
    //         relations: ['user'],
    //     });

    //     if (!artist) {
    //         throw new NotFoundException('Artist not found');
    //     }

    //     const user = artist.user;
    //     if (user && user.roles.includes(UserRoles.USER) && !user.roles.includes(UserRoles.ARTIST)) {
    //         user.roles = [UserRoles.ARTIST]
    //         await this.userService.saveUser(user)
    //     }

    //     artist.isVerified = true;
    //     return await this.artistRepo.save(artist);
    // }


}
