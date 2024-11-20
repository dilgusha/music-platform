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
import { UpdateMusicDto } from "./dto/update-music.dto";
import { ImageValidationService } from "src/shared/services/image-validation.service";
import { ArtistEntity } from "src/database/entities/Artist.entity";
import { ArtistService } from "../artist/artist.service";

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
        private uploadService: UploadService,
        private readonly imageValidationService: ImageValidationService,
        @InjectRepository(ArtistEntity)
        private artistRepo: Repository<ArtistEntity>,

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

        const existingMusic = await this.musicRepo.findOne({
            where: { name: params.name }
        })
        if (existingMusic) throw new ForbiddenException('Music with the same name already exists')
        let image: ImageEntity | undefined = undefined;
        if (params.coverImageId) {
            await this.imageValidationService.validateImageUsage(params.coverImageId);
        }
        let filename: string;
        try {
            const uploadResult = await this.musicUploadService.uploadFile(file);
            filename = uploadResult.filename;
        } catch (error) {
            throw new BadRequestException('File upload failed.');
        }
        const artist = await this.getArtistByUser(myUser);


        const music = this.musicRepo.create({ ...params, categories, track: filename, artist, coverImage: image });

        if (params.coverImageId) {
            const image = await this.uploadService.findImageById(params.coverImageId);

            if (!image) throw new NotFoundException('Image not found');
            music.coverImage = image;
        }

        await this.musicRepo.save(music);
        return music;
    }

    async getArtistByUser(user: UserEntity): Promise<ArtistEntity> {
        if (user.roles.includes(UserRoles.ARTIST)) {
            const artist = await this.artistRepo.findOne({
                where: { user: { id: user.id } },
                relations: ['user']
            });
            if (!artist) {
                throw new BadRequestException('User is not associated with an artist');
            }
            return artist;
        }
        throw new ForbiddenException('User does not have artist role');
    }



    async delete(id: number) {
        const myUser = await this.cls.get<UserEntity>('user')
        if (!myUser) throw new NotFoundException('User not found');

        if (!myUser.roles || !myUser.roles.includes(UserRoles.ADMIN)) throw new ForbiddenException('Only admins can delete music');

        let result = await this.musicRepo.delete({ id })
        if (result.affected === 0) throw new NotFoundException()
        return {
            message: 'Music deleted successfully'
        }
    }



    async update(id: number, params: UpdateMusicDto,): Promise<MusicEntity> {
        const myUser = await this.cls.get<UserEntity>('user')
        if (!myUser) throw new NotFoundException('User not found');
        if (!myUser.roles || !myUser.roles.includes(UserRoles.ADMIN)) throw new ForbiddenException('Only admins can update music');

        const music = await this.musicRepo.findOne({
            where: { id },
            relations: ['coverImage', 'categories']
        })

        if (!music) throw new NotFoundException('Music not found');

        const existingMusic = await this.musicRepo.findOne({
            where: { name: params.name }
        })
        if (existingMusic) throw new ForbiddenException('Music with the same name already exists')
        if (params.categories && params.categories.length > 0) {
            const categories = await this.categoryService.findByIds(params.categories);
            if (categories.length !== params.categories.length) {
                throw new BadRequestException('One or more categories are invalid');
            }
            music.categories = categories;
        }

        if (params.coverImage) {
            await this.imageValidationService.validateImageUsage(params.coverImage);
        }
        if (params.coverImage) {
            const coverImage = await this.uploadService.findImageById(params.coverImage)
            if (!coverImage) throw new BadRequestException('Invalid cover image ID')
            music.coverImage = coverImage
        }

        Object.assign(music, params)
        return await this.musicRepo.save(music);

    }


}
