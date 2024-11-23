import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FollowEntity } from "src/database/entities/Follow.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateFollowDto } from "./dto/create-follow.dto";
import { UserEntity } from "src/database/entities/User.entity";
import { UserService } from "../user/user.service";
import { ClsService } from 'nestjs-cls';
// import { FollowStatus } from "src/shared/enum/follow.enum";
import { FindParams } from "src/shared/types/find.params";
import { FollowStatus } from "src/shared/enum/follow.enum";

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(FollowEntity)
        private followRepo: Repository<FollowEntity>,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private cls: ClsService
    ) { }


    // async repeatCode(userId: number, followedMyUser: boolean) {
    //     let myUser = await this.cls.get<Promise<UserEntity>>('user')
    //     let user = await this.userService.findOne({ where: { id: userId } });
    //     if (!user) throw new NotFoundException('User not found');
    //     let whereOption;
    //     if (followedMyUser) {
    //         whereOption = {
    //             followerUser: { id: user.id },
    //             followedUser: { id: myUser.id },
    //         };
    //     } else {
    //         whereOption = {
    //             followedUser: { id: user.id },
    //             followerUser: { id: myUser.id },
    //         };
    //     }
    //     console.log('Where Option:', JSON.stringify(whereOption));


    //     const follow = await this.followRepo.createQueryBuilder('follow')
    //         .leftJoinAndSelect('follow.followerUser', 'followerUser')
    //         .leftJoinAndSelect('follow.followedUser', 'followedUser')
    //         .where('followerUser.id = :followerId', { followerId: user.id })
    //         .andWhere('followedUser.id = :followedId', { followedId: myUser.id })
    //         .getOne();

    //     console.log('Query Result:', follow);

    //     if (!follow) {
    //         console.log('Follow not found:', whereOption);
    //         throw new NotFoundException('Follow request not found');
    //     }
    //     return { myUser, user, follow };

    // }

    async repeatCode(userId: number, followedMyUser: boolean) {
        const myUser = await this.cls.get<Promise<UserEntity>>('user');
        const user = await this.userService.findOne({ where: { id: userId } });
    
        if (!user) throw new NotFoundException('User not found');
    
        const whereOption = followedMyUser
            ? {
                  followerUser: { id: myUser.id },  
                  followedUser: { id: user.id },    
              }
            : {
                  followerUser: { id: user.id },    
                  followedUser: { id: myUser.id }, 
              };
    
        // console.log('Where Option:', JSON.stringify(whereOption));
    
        const follow = await this.followRepo.createQueryBuilder('follow')
            .leftJoinAndSelect('follow.followerUser', 'followerUser')
            .leftJoinAndSelect('follow.followedUser', 'followedUser')
            .where('followerUser.id = :followerId', { followerId: whereOption.followerUser.id })
            .andWhere('followedUser.id = :followedId', { followedId: whereOption.followedUser.id })
            .getOne();
    
        // console.log('Query Result:', follow);
    
        if (!follow) {
            console.log('Follow not found:', whereOption);
            throw new NotFoundException('Follow request not found');
        }
    
        return { myUser, user, follow };
    }
    

    async findOne(params: Omit<FindParams<FollowEntity>, 'limit' | 'page'>) {
        const { where, select, relations } = params
        return this.followRepo.findOne({ where, select, relations })
    }
    async find(params: FindParams<FollowEntity>) {
        const { where, select, relations } = params
        return await this.followRepo.find({ where, select, relations })

    }
    async create(params: CreateFollowDto) {
        const myUser = await this.cls.get<Promise<UserEntity>>('user');
        if (!myUser) {
            throw new NotFoundException('User not authenticated');
        }

        const user = await this.userService.findOne({ where: { id: params.userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.id === myUser.id) {
            throw new BadRequestException('You cannot follow yourself');
        }

        const existingFollow = await this.findOne({
            where: {
                followerUser: { id: myUser.id },
                followedUser: { id: user.id },
            }
        });

        if (existingFollow) {
            throw new ConflictException('You are already following this user');
        }

        const follow = this.followRepo.create({
            followerUser: { id: myUser.id },
            followedUser: { id: user.id },
            status: FollowStatus.FOLLOWING
        });

        user.followerCount++;
        myUser.followedCount++;

        await Promise.all([
            follow.save(),
            user.save(),
            myUser.save()
        ]);

        return {
            status: true,
            message: 'Successfully followed user',
            follow
        };
    }


    async removeFollow(userId: number) {
        const { myUser, user, follow } = await this.repeatCode(userId, false)

        if (follow.status == FollowStatus.FOLLOWING) {
            if (myUser.followerCount === 0) {
                throw new BadRequestException('Your follower count is already at zero and cannot be reduced further.');
            }
            if (user.followedCount === 0) {
                throw new BadRequestException('The followed user’s count is already at zero and cannot be reduced further.');
            }
            myUser.followerCount--;
            user.followedCount--;
            await Promise.all([myUser.save(), user.save()])
        }

        await follow.remove()

        return {
            status: true,
            message: 'You have successfully removed this follow request'
        }
    }

    async unFollow(userId: number) {
        const { myUser, user, follow } = await this.repeatCode(userId, true)

        if (follow.status == FollowStatus.FOLLOWING) {
            if (user.followerCount === 0) {
                throw new BadRequestException('The user’s follower count is already at zero and cannot be reduced further.');
            }
            if (myUser.followedCount === 0) {
                throw new BadRequestException('Your followed count is already at zero and cannot be reduced further.');
            }
            user.followerCount--;
            myUser.followedCount--;
            await Promise.all([myUser.save(), user.save()])
        }

        await follow.remove();
        return {
            status: true,
            message: 'You have successfully unfollow'
        }
    }


}