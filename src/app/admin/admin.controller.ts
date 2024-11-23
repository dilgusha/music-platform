import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRoles } from "src/shared/enum/user.enum";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard)

export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('settings')
    @Roles(UserRoles.ADMIN)
    async getSettings() {
        return this.adminService.getSettings();
    }

    @Post('settings')
    @Roles(UserRoles.ADMIN)
    async updateSettings(@Body() body: UpdateSettingsDto) {
        return this.adminService.updateSettings(body);
    }

    @Get('pending-artists')
    @Roles(UserRoles.ADMIN)
    async getPendingArtists() {
        return await this.adminService.getAllArtistRequest();
    }

    @Post('verify-artist/:id')
    @Roles(UserRoles.ADMIN)
    async verifyArtist(@Param('id') id: number) {
        return await this.adminService.verifyArtist(id);
    }
}