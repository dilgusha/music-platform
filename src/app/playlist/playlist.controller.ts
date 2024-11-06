import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { PlaylistService } from "./playlist.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { UpdatePlaylistDto } from "./dto/update-playlist.dto";
import { MusicService } from "../music/music.service";
import { PlaylistEntity } from "src/database/entities/Playlist.entity";

@Controller('playlist')
@ApiTags('playlist')
@UseGuards(AuthGuard)
@ApiBearerAuth()

export class PlaylistController {
    constructor(
        private playlistService: PlaylistService,
    ) { }


    @Get()
    myPlaylist() {
        return this.playlistService.myPlaylist({})
    }


    @Get(':id')
    findOnePlaylist(@Param('id') id: number) {
        return this.playlistService.findOnePlaylist(id, { relations: ['musics'] })
    }


    @Post()
    @ApiOperation({ summary: 'Create playlist' })
    create(@Body() body: CreatePlaylistDto) {
        return this.playlistService.create(body)
    }

    @Post(':id')
    @ApiOperation({ summary: 'Update playlist' })
    async update(@Param('id') id: number, @Body() body: UpdatePlaylistDto) {
        return await this.playlistService.update(id, body);
    }

    @Post(':playlistId/add-music/:musicId')
    @ApiOperation({ summary: 'Add Music to Playlist' })
    async addMusicToPlaylist(
        @Param('playlistId') playlistId: number,
        @Param('musicId') musicId: number,
    ) {
        return await this.playlistService.addMusicToPlaylist(playlistId, musicId);
    }

    @Post(':playlistId/remove-music/:musicId')
    @ApiOperation({ summary: 'Remove Music from Playlist' })
    async removeMusicFromPlaylist(
        @Param('playlistId') playlistId: number,
        @Param('musicId') musicId: number,
    ) {
        return await this.playlistService.removeMusicFromPlaylist(playlistId, musicId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete playlist' })
    async delete(@Param('id') id: number) {
        return await this.playlistService.delete(id);
    }

    // @Get(':playlistId/sorted-music')
    // @ApiOperation({ summary: 'Sort Music in Playlist' })
    // async getSortedMusic(@Param('playlistId') playlistId: number) {
    //     try {
    //         const sortedMusics = await this.playlistService.sortPlaylist(playlistId);
    //         return sortedMusics;
    //     } catch (error) {
    //         throw new NotFoundException('Playlist or musics not found');
    //     }
    // }

    @Post(':playlistId/shuffle')
    @ApiOperation({ summary: 'Shuffle Music in Playlist' })
    async shufflePlaylistMusics(
        @Param('playlistId') playlistId: number,
    ): Promise<PlaylistEntity> {
        return await this.playlistService.shufflePlaylistMusics(playlistId);
    }

    @Get(':id/sorted')
    @ApiOperation({ summary: 'Sort Playlist by Added Time' })
    async getPlaylistSortedByAddedTime(@Param('id') playlistId: number): Promise<PlaylistEntity> {
        return await this.playlistService.sortPlaylistByAddedTime(playlistId);
    }
}