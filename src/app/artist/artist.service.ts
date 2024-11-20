import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ArtistEntity } from "src/database/entities/Artist.entity";
import { UserEntity } from "src/database/entities/User.entity";
import { ClsService } from "nestjs-cls";
import { UserRoles } from "src/shared/enum/user.enum";
import { ApplyForArtistDto } from "./dto/apply-artist.dto";
@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(ArtistEntity)
        private artistRepo: Repository<ArtistEntity>,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private cls: ClsService
    ) { }


    async findOne(){
        
    }

    async applyForArtist(dto: ApplyForArtistDto): Promise<ArtistEntity> {
        const myUser = await this.cls.get<UserEntity>('user')
        if (!myUser) throw new ForbiddenException('User not found')
        console.log('User:', myUser);
        console.log('User Roles:', myUser?.roles);

        if (!myUser || !Array.isArray(myUser.roles) || !myUser.roles.includes(UserRoles.USER)) {
            throw new UnauthorizedException('You are not eligible to apply for an artist profile');
        }

        const artist = new ArtistEntity();
        artist.user = myUser;
        artist.biography = dto.biography;
        artist.topTracks = dto.topTracks;
        artist.isVerified = false; 

        try {
            return await this.artistRepo.save(artist);
        } catch (error) {
            console.error('Error saving artist:', error);
            throw new Error('Failed to save artist');
        }
    }

    async verifyArtist(artistId: number): Promise<ArtistEntity> {
        const artist = await this.artistRepo.findOne({
            where: { id: artistId },
            relations: ['user'],
        });

        if (!artist) {
            throw new NotFoundException('Artist not found');
        }

        const user = artist.user;
        if (user && user.roles.includes(UserRoles.USER) && !user.roles.includes(UserRoles.ARTIST)) {
            user.roles=[UserRoles.ARTIST]
            await this.userService.saveUser(user)
        }

        artist.isVerified = true;
        return await this.artistRepo.save(artist);
    }


}
