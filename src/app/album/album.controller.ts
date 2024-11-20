import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AlbumService } from "./album.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRoles } from "src/shared/enum/user.enum";
import { UpdateALbumDto } from "./dto/update-album.dto";

@Controller('album')
@ApiTags('album')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Roles(UserRoles.ARTIST)

export class AlbumController {
    constructor(private albumService: AlbumService) { }

    @Post()
    @ApiOperation({ summary: 'Create album' })
    createAlbum(@Body() body: CreateAlbumDto) {
        return this.albumService.create(body)
    }

    @Get()
    @ApiOperation({ summary: 'Get all albums' })
    getAllAlbums() {
        return this.albumService.find()
    }

    @Get()
    @ApiOperation({ summary: 'Get album' })
    getAlbum() {
        return this.albumService.findOne()
    }


    @Post(':id')
    @ApiOperation({ summary: 'Update album' })
    async updateAlbum(@Param('id') id: number, @Body() body: UpdateALbumDto) {
        return await this.albumService.update(id, body)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete album' })
    deleteAlbum(@Param('id') id: number) {
        return this.albumService.delete(id)
    }

    @Post(':albumId/add-track/:musicId')
    @ApiOperation({ summary: 'Add Track to Album' })
    async addTrack(@Param('albumId') albumId: number,
        @Param('musicId') musicId: number) {
        return await this.albumService.addTrack(albumId, musicId)
    }

    @Post(':albumId/remove-track/:musicId')
    @ApiOperation({ summary: 'Remove Track from Album' })
    async removeTrack(@Param('albumId') albumId: number,
        @Param('musicId') musicId: number) {
        return await this.albumService.removeTrack(albumId, musicId)
    }
}