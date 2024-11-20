import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
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
}