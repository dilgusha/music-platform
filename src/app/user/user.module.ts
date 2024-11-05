import { forwardRef, Global, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/User.entity";
import { ArtistModule } from "../artist/artist.module";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => ArtistModule),],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }