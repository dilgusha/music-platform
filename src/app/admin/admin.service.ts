import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeneralSettingsEntity } from "src/database/entities/GeneralSettings.entity";
import { Repository } from "typeorm";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { ImageEntity } from "src/database/entities/Image.entity";
import { ClsService } from "nestjs-cls";
import { UserEntity } from "src/database/entities/User.entity";
import { UserRoles } from "src/shared/enum/user.enum";
import { ImageValidationService } from "src/shared/services/image-validation.service";
import { ArtistService } from "../artist/artist.service";
import { ArtistEntity } from "src/database/entities/Artist.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(GeneralSettingsEntity)
        private generalSettingsRepo: Repository<GeneralSettingsEntity>,
        @InjectRepository(ImageEntity)
        private readonly imageRepo: Repository<ImageEntity>,
        private cls: ClsService,
        private readonly imageValidationService: ImageValidationService,
        private artistService: ArtistService,
        private userService: UserService
    ) { }


    //Admin olub olmadigini tapa bilmir myUseri yeni cls de sorun var onu duzelt

    async getSettings(): Promise<GeneralSettingsEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) {
            throw new ForbiddenException('User information is missing');
        }
        console.log('Current User:', myUser);
        if (!myUser?.roles.includes(UserRoles.ADMIN)) {
            throw new ForbiddenException('Only admins can update settings');
        }
        return await this.generalSettingsRepo.findOne({ where: { id: 1 } });

    }

    async updateSettings(params: UpdateSettingsDto): Promise<GeneralSettingsEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) {
            throw new ForbiddenException('User information is missing');
        }

        if (!myUser?.roles || !myUser?.roles.includes(UserRoles.ADMIN)) {
            throw new ForbiddenException('Only admins can create music');
        }

        if (params.logoId) {
            await this.imageValidationService.validateImageUsage(params.logoId);
        }

        let settings = await this.generalSettingsRepo.findOne({ where: { id: 1 } });

        if (!settings) {
            settings = this.generalSettingsRepo.create();
            await this.generalSettingsRepo.save(settings);
        }

        if (params.logoId) {
            const logoImage = await this.imageRepo.findOne({ where: { id: params.logoId } });
            if (logoImage) {
                settings.logo = logoImage;
            } else {
                throw new Error('Logo image not found');
            }
        }
        const updatedSettings = { ...settings, ...params };

        return await this.generalSettingsRepo.save(updatedSettings);
    }


    async verifyArtist(artistId: number): Promise<ArtistEntity> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser || !myUser.roles.includes(UserRoles.ADMIN)) {
            throw new ForbiddenException('Only admins can verify artists');
        }

        const artist = await this.artistService.findById(artistId); 
        if (!artist) throw new NotFoundException('Artist not found');

        if (artist.isVerified) throw new BadRequestException('Artist is already verified');

        const user = artist.user;
        if (user && user.roles.includes(UserRoles.USER) && !user.roles.includes(UserRoles.ARTIST)) {
            user.roles = [...user.roles, UserRoles.ARTIST]; 
            await this.userService.saveUser(user);
        }

        artist.isVerified = true;
        return await this.artistService.save(artist); 
    }


    async getAllArtistRequest(): Promise<ArtistEntity[]> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser || !myUser.roles.includes(UserRoles.ADMIN)) {
            throw new ForbiddenException('Only admins can view artist applications');
        }

        return await this.artistService.findPending();
    }



}