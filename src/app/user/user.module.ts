import { forwardRef, Global, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/User.entity";
import { ArtistModule } from "../artist/artist.module";
import { UploadModule } from "../upload/upload.module";
import { SharedModule } from "src/shared/shared.module";
import { ArtistEntity } from "src/database/entities/Artist.entity";
// import { ArtistModule } from "../artist/artist.module";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity,ArtistEntity]),UploadModule,SharedModule,ArtistModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],         
})
export class UserModule { }