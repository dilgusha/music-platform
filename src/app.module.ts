import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import config from './config';
import { AuthModule } from './app/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ClsGuard, ClsModule } from 'nestjs-cls';
import {  UploadModule } from './app/upload/upload.module';
import { CategoryModule } from './app/category/category.module';
import { MusicModule } from './app/music/music.module';
import { CategoryEntity } from './database/entities/Category.entity';
import { ImageEntity } from './database/entities/Image.entity';
import { CommonEntity } from './database/entities/Common.entity';
import { MusicEntity } from './database/entities/Music.entity';
import { UserEntity } from './database/entities/User.entity';
import { APP_GUARD } from '@nestjs/core';
import { PlaylistModule } from './app/playlist/playlist.module';
import { FollowModule } from './app/follow/follow.module';
import { AdminModule } from './app/admin/admin.module';
import { ArtistModule } from './app/artist/artist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: +config.database.port,
      username: config.database.username,
      password: config.database.pass,
      database: config.database.dbName,
      // migrations: [`${__dirname}/**/migrations/*.js`],
      entities: [`${__dirname}/**/*.entity.{ts,js}`],
      // migrations: [`${__dirname}/**/migrations/*.js`],
      synchronize: true,
      logging: true,
    }),
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '10h' },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      guard: { mount: true },
    }),
    UserModule,
    AuthModule,
    UploadModule,
    CategoryModule,
    MusicModule,
    PlaylistModule,
    FollowModule,
    AdminModule,
    ArtistModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ClsGuard,
  },],
})
export class AppModule { }
