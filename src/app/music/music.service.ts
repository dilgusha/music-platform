import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { MusicEntity } from "src/database/entities/Music.entity";
import { UserEntity } from "src/database/entities/User.entity";
import { FindOneParams, FindParams } from "src/shared/types/find.params";
import { In, Repository } from "typeorm";
import { CreateMusicDto } from "./dto/create-music.dto";
import { UserRoles } from "src/shared/enum/user.enum";
import { ImageEntity } from "src/database/entities/Image.entity";
import { CategoryService } from "../category/category.service";
import { MusicUploadService } from "./musicUpload.service";
import { UploadService } from "../upload/upload.service";

@Injectable()
export class MusicService {
    createQueryBuilder(arg0: string) {
        throw new Error("Method not implemented.");
    }
    constructor(
        @InjectRepository(MusicEntity)
        private musicRepo: Repository<MusicEntity>,
        private categoryService: CategoryService,
        private cls: ClsService,
        private musicUploadService: MusicUploadService,
        private uploadService: UploadService
    ) { }

    async find(params?: FindParams<MusicEntity>) {
        const { where, select, order, limit, page, relations } = params
        return await this.musicRepo.find({
            where, select, order, relations, take: limit, skip: limit * page || 0
        })
    }

    async findOne(params: FindOneParams<MusicEntity>) {
        const { where, select, relations } = params
        return await this.musicRepo.findOne({
            where, select, relations
        })
    }


    async create(params: CreateMusicDto, file: Express.Multer.File): Promise<MusicEntity> {
        const categories = await this.categoryService.findByIds(params.categories);

        let myUser = await this.cls.get<UserEntity>('user')

        if (!myUser.roles || !myUser.roles.includes(UserRoles.ADMIN)) {
            throw new ForbiddenException('Only admins can create music');
        }

        let filename: string;
        try {
            const uploadResult = await this.musicUploadService.uploadFile(file);
            filename = uploadResult.filename;
        } catch (error) {
            throw new BadRequestException('File upload failed.');
        }
        const coverImage = await this.uploadService.findImageById( params.coverImageId);
        if (!coverImage) {
            throw new BadRequestException('Invalid cover image ID');
        }

        const music = this.musicRepo.create({ ...params, categories, track: filename, coverImage });
        await this.musicRepo.save(music);
        return music;
    }

    async delete(id: number) {
        const myUser = await this.cls.get<UserEntity>('user')
        if(!myUser) throw new NotFoundException('User not found');

        if(!myUser.roles || !myUser.roles.includes(UserRoles.ADMIN)) throw new ForbiddenException('Only admins can delete music');

        let result = await this.musicRepo.delete({ id })
        if (result.affected === 0) throw new NotFoundException()
        return {
            message: 'Music deleted successfully'
        }
    }




    

    //Music update qalib onu duzelt







    // async updateOrderInPlaylist(playlistId: number, orderedMusicIds: number[]) {
    //     // `orderedMusicIds` sırasına göre playlist içindeki `order` değerlerini güncelle
    //     for (let i = 0; i < orderedMusicIds.length; i++) {
    //         const musicId = orderedMusicIds[i];
    //         await this.playlistMusicRepo.update(
    //             { playlist: { id: playlistId }, music: { id: musicId } },
    //             { order: i + 1 } // 1'den başlayan sıralama
    //         );
    //     }

    //     return { status: true, message: 'Playlist reordered successfully' };
    // }



}
