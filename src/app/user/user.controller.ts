import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { UserEntity } from "src/database/entities/User.entity";
import { ClsService } from "nestjs-cls";
import { USER_PROFILE_SELECT, USER_PUBLIC_SELECT } from "./user-select";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRoles } from "src/shared/enum/user.enum";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('User')
@ApiTags('User')
@UseGuards(AuthGuard)
@ApiBearerAuth()

export class UserController {
    constructor(private userService: UserService,
        private cls: ClsService
    ) { }


    @Get()
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Admin view all users' })
    async findAll() {
        return this.userService.find({});
    }
    @Get('/myProfile')
    @ApiOperation({ summary: 'User view own profile' })
    async myProfile() {
        let user = await this.cls.get<UserEntity>('user')
        return this.userService.findOne({ where: { id: user.id }, select: USER_PROFILE_SELECT });
    }

    @Get('/profile/:id')
    @ApiOperation({ summary: 'Users view other profile' })
    async userProfile(@Param('id') id: number) {
        let user = await this.userService.findOne({
            where: { id },
            select: USER_PUBLIC_SELECT
        });

        if (!user) throw new NotFoundException();
        return user;
    }

    @Post('profile')
    @ApiOperation({ summary: 'User Update own profile' })
    updateProfile(@Body() params: UpdateUserDto) {
        return this.userService.update(params);
    }

    @Post(':id')
    @ApiOperation({ summary: 'Admin Update User' })
    @Roles(UserRoles.ADMIN)
    updateUser(@Param('id') id: number, @Body() params: UpdateUserDto) {
        return this.userService.update(params, id);
    }

    @Delete('profile')
    @ApiOperation({ summary: 'User Delete own profile' })
    deleteProfile() {
        return this.userService.delete();
    }

    @Delete(':id')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Admin Delete user profile' })
    deleteUser(@Param('id') id: number) {
        return this.userService.delete(id);
    }
}
