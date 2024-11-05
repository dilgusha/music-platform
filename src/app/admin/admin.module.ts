import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralSettingsEntity } from "src/database/entities/GeneralSettings.entity";
import { ImageEntity } from "src/database/entities/Image.entity";

@Module({
    imports: [TypeOrmModule.forFeature([GeneralSettingsEntity,ImageEntity])],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule { }