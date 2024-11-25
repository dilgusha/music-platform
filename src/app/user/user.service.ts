import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/User.entity";
import { FindManyOptions, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create.user.dto";
import { FindParams } from "src/shared/types/find.params";
import { ClsService } from "nestjs-cls";
import { UserRoles } from "src/shared/enum/user.enum";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UploadService } from "../upload/upload.service";
import { ImageValidationService } from "src/shared/services/image-validation.service";
import { USER_PROFILE_SELECT } from "./user-select";
import { ArtistEntity } from "src/database/entities/Artist.entity";

@Injectable()

export class UserService {
    constructor(@InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
        private cls: ClsService,
        private uploadService: UploadService,
        private readonly imageValidationService: ImageValidationService,
        @InjectRepository(ArtistEntity)
        private artistRepo: Repository<ArtistEntity>

    ) { }


    async saveUser(user: UserEntity): Promise<UserEntity> {
        return this.userRepo.save(user);
    }
    async find(params: FindParams<UserEntity>) {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) throw new NotFoundException('User not found')
        if (!myUser?.roles.includes(UserRoles.ADMIN)) {
            throw new ForbiddenException('Only admins can view users');
        }
        const { where, select, relations, limit, page } = params
        let payload: FindManyOptions<UserEntity> = { where, select, relations }
        if (limit > 0) { payload.take = limit, payload.skip = limit * page }
        return this.userRepo.find(payload)
    }


    findOne(params: Omit<FindParams<UserEntity>, 'limit' | 'page'>) {
        const { where, select, relations } = params
        return this.userRepo.findOne({ where, relations, select })
    }

    findById(id: number) {
        return this.userRepo.findOne({
            where: {
                id
            },
            relations: ['roles'],
        })
    }

    async getMyProfile(): Promise<UserEntity | null> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) throw new NotFoundException('User not found');
        return this.findOne({ where: { id: myUser.id }, select: USER_PROFILE_SELECT, relations: ['playlists', 'profileImage', 'artist'] });
    }

    async getUserProfile(id: number): Promise<UserEntity | null> {
        const myUser = await this.cls.get<UserEntity>('user');
        if (!myUser) throw new NotFoundException('User not found');
        return this.findOne({ where: { id }, select: USER_PROFILE_SELECT, relations: ['playlists', 'profileImage'] });
    }

    async create(params: CreateUserDto) {
        let checkUserName = await this.findOne({ where: { userName: params.userName } });
        if (checkUserName) throw new ConflictException("Username already exists")
        let checkUserEmail = await this.findOne({ where: { email: params.email } })
        if (checkUserEmail) throw new ConflictException("Email already exists")
        let user = this.userRepo.create(params)
        await user.save()
        return user
    }



    // Bunlar adminin ede bileceyi seylerdi ona gore duzeltmeler et


    // async updateProfile(params: UpdateUserDto) {
    //     console.log('UpdateProfile - Before getting user'); 
    //     const myUser = await this.cls.get<UserEntity>('user');
    //     console.log('UpdateProfile - myUser:', myUser); 
    //     console.log('UpdateProfile - CLS context:', await this.cls.get('context')); 

    //     if (!myUser) {
    //         
    //         console.log('UpdateProfile - Full CLS context:', this.cls.getId());
    //         throw new ForbiddenException('User not authenticated');
    //     }

    //     const user = await this.findOne({ where: { id: myUser.id } });
    //     if (!user) throw new NotFoundException("User not found");

    //    
    //     const updatedUser = Object.assign({}, user, params);
    //     return this.userRepo.save(updatedUser);
    // }

    // async updateProfile(params: UpdateUserDto) {
    //     const myUser = await this.cls.get<UserEntity>('user');

    //     if (!myUser) {
    //         throw new ForbiddenException('User not authenticated');
    //     }

    //     const user = await this.findOne({ where: { id: myUser.id } });
    //     if (!user) {
    //         throw new NotFoundException("User not found");
    //     }

    //     Object.assign(user, params);
    //     return this.userRepo.save(user);
    // }



    // async update(id: number, params: UpdateUserDto) {
    //     return await this.userRepo.update({ id }, params);
    // }


    async update(params: UpdateUserDto, targetUserId?: number) {
        const myUser = await this.cls.get<UserEntity>('user');

        if (!myUser) {
            throw new ForbiddenException('User not authenticated');
        }
        if (params.profileImage) {
            await this.imageValidationService.validateImageUsage(params.profileImage, targetUserId);
        }

        const userId = targetUserId || myUser.id;

        if (targetUserId && targetUserId !== myUser.id && !myUser.roles.includes(UserRoles.ADMIN)) {
            throw new ForbiddenException('Only admins can update other users');
        }

        const user = await this.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        // if (params.email && params.email !== user.email) {
        //     const emailExists = await this.findOne({ where: { email: params.email } });
        //     if (emailExists) {
        //         throw new ConflictException("Email already exists");
        //     }
        // }

        if (params.userName && params.userName !== user.userName) {
            const userNameExists = await this.findOne({ where: { userName: params.userName } });
            if (userNameExists) {
                throw new ConflictException("Username already exists");
            }
        }
        if (params.profileImage) {
            const image = await this.uploadService.findImageById(params.profileImage);
            if (!image) {
                throw new BadRequestException('Profile image not found');
            }
        }

        Object.assign(user, params);
        const updatedUser = await this.userRepo.save(user);

        return {
            status: true,
            message: 'User updated successfully',
            user: updatedUser
        };
    }
    async delete(targetUserId?: number) {
        const myUser = await this.cls.get<UserEntity>('user');

        if (!myUser) {
            throw new ForbiddenException('User not authenticated');
        }
        const userId = targetUserId || myUser.id;

        if (userId !== myUser.id && !myUser.roles.includes(UserRoles.ADMIN)) {
            throw new ForbiddenException('You can only delete your own account or must be an admin');
        }

        const user = await this.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        await this.artistRepo.delete({ user: { id: userId } });

        await this.userRepo.remove(user);

        return {
            status: true,
            message: userId === myUser.id
                ? 'Your account has been deleted successfully'
                : 'User has been deleted successfully'
        };
    }

}