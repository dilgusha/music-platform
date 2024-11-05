import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeneralSettingsEntity } from "src/database/entities/GeneralSettings.entity";
import { Repository } from "typeorm";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { ImageEntity } from "src/database/entities/Image.entity";
import { ClsService } from "nestjs-cls";
import { UserEntity } from "src/database/entities/User.entity";
import { UserRoles } from "src/shared/enum/user.enum";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(GeneralSettingsEntity)
        private generalSettingsRepo: Repository<GeneralSettingsEntity>,
        @InjectRepository(ImageEntity)
        private readonly imageRepo: Repository<ImageEntity>,
        private cls: ClsService
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

}