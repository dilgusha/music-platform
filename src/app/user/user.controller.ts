import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { ClsService } from "nestjs-cls";
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

    @Get('/profile/:id')
    @ApiOperation({ summary: 'Users view other profile' })
    async userProfile(@Param('id') id: number) {
        return await this.userService.getUserProfile(id)
    }


    @Get('/myProfile')
    @ApiOperation({ summary: 'User view own profile' })
    async myProfile() {
        return await this.userService.getMyProfile();
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
