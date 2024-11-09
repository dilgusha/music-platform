import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from 'src/database/entities/Artist.entity';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { UserModule } from '../user/user.module';
import { UserEntity } from 'src/database/entities/User.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ArtistEntity,UserEntity]),
    ],
    providers: [ArtistService],
    controllers: [ArtistController],
    exports: [ArtistService],
})
export class ArtistModule {}
