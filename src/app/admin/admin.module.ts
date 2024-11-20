import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralSettingsEntity } from "src/database/entities/GeneralSettings.entity";
import { ImageEntity } from "src/database/entities/Image.entity";
import { SharedModule } from "src/shared/shared.module";

@Module({
    imports: [TypeOrmModule.forFeature([GeneralSettingsEntity,ImageEntity]),SharedModule],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule { }