import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ClsService } from "nestjs-cls";
import { ImageEntity } from "src/database/entities/Image.entity";
import { UserEntity } from "src/database/entities/User.entity";
import { UserRoles } from "src/shared/enum/user.enum";
import { Repository } from "typeorm";

@Injectable()

export class UploadService {
    constructor(@InjectRepository(ImageEntity)
    private imageRepo: Repository<ImageEntity>,
        private cls: ClsService
    ) { }

    async uploadImage(req: Request, file: Express.Multer.File,description: string) {
        const myUser = this.cls.get<UserEntity>('user');
        if (!myUser) throw new ForbiddenException('User information not found.');

        let port = req.socket.localPort
        let image = this.imageRepo.create({
            filename: file.filename,
            url: `${req.protocol}://${req.hostname}${port ? `:${port} ` : ''}/uploads/${file.filename}`,
            userId: myUser.id,
            description: req.body.description,
        })

        // await image.save()
        await this.imageRepo.save(image);
        return image;
    }

    async findImageById(id: number): Promise<ImageEntity> {
        const image = await this.imageRepo.findOne({ where: { id } });
        if (!image) throw new NotFoundException('Image not found');
        return image;
    }

    async deleteImage(id: number) {
        const myUser = await this.cls.get<UserEntity>('user')
        if (!myUser) throw new ForbiddenException('User information not found.');
        const image = await this.findImageById(id);

        // const uploadedByUserId = await this.imageRepo
        //     .createQueryBuilder("image")
        //     .select("image.userId")
        //     .where("image.id = :id", { id })
        //     .getRawOne();

        // const isOwner = uploadedByUserId?.userId === myUser.id;

        const isOwner = image.userId === myUser.id;

        if (!isOwner || !myUser.roles.includes(UserRoles.ADMIN)) throw new ForbiddenException('You do not have permission to delete this image.')
        await this.imageRepo.remove(image);
        return {
            message: 'Image deleted successfully'
        }
    }
    async deleteImages(images: ImageEntity[]) {
        return await this.imageRepo.remove(images);
    }
}