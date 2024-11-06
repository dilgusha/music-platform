// // artist.module.ts
// import { Module, forwardRef } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from '../user/user.module';
// import { ArtistEntity } from 'src/database/entities/Artist.entity';
// import { ArtistService } from './artist.service';
// import { ArtistController } from './artist.controller';

// @Module({
//     imports: [
//         TypeOrmModule.forFeature([ArtistEntity]),
//         forwardRef(() => UserModule),
//     ],
//     providers: [ArtistService],
//     controllers: [ArtistController],
//     exports: [ArtistService],
// })
// export class ArtistModule {}
