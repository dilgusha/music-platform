// artist.controller.ts
import { Controller, Post, Body, UseGuards, Req, Param, Get } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { UserEntity } from 'src/database/entities/User.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApplyForArtistDto } from './dto/apply-artist.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from 'src/database/entities/Artist.entity';

@Controller('artists')
@ApiTags('artist')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ArtistController {
    constructor(private readonly artistService: ArtistService) { }
    @Get('my-profile')
    async getMyProfile(): Promise<ArtistEntity> {
        return await this.artistService.getMyArtistProfile();
    }

    @Post('apply')
    async applyForArtist(
        @Body() applyForArtistDto: ApplyForArtistDto,
        @Req() request: any
    ) {
        console.log('Authenticated user:', request.user);
        const user = request.user as UserEntity;
        return this.artistService.applyForArtist(applyForArtistDto);
    }

    @Post('update-artist')
    async updateArtistDetails(
        @Body() body: UpdateArtistDto,
    ) {
        return this.artistService.updateArtistDetails(body)
    }



    //Admin service-e kocuruldu

    // @Post('verify/:artistId')
    // @UseGuards(AuthGuard)
    // async verifyArtist(@Param('artistId') artistId: number) {
    //     return this.artistService.verifyArtist(artistId);
    // }
}

