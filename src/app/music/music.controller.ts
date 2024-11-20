import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MusicService } from "./music.service";
import { CreateMusicDto } from "./dto/create-music.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { MusicUploadService } from "./musicUpload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from 'multer';
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRoles } from "src/shared/enum/user.enum";
import { UpdateMusicDto } from "./dto/update-music.dto";


@Controller('music')
@ApiTags('music')
@UseGuards(AuthGuard)
@ApiBearerAuth()

export class MusicController {
    constructor(private musicService: MusicService,
        private musicUploadService: MusicUploadService
    ) { }

    @Get()
    findSongs() {
        return this.musicService.find({});
    }
    @Get(':id')
    findSong(@Param('id') id: number) {
        return this.musicService.findOne({ where: { id } });
    }

    @Post('uploadSong')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Upload a new song' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'Music file (audio)' },
                name: { type: 'string' },
                duration: { type: 'number' },
                coverImageId: { type: 'number' },
                releaseDate: { type: 'string', format: 'date-time' },
                description: { type: 'string' },
                categories: { type: 'array', items: { type: 'number' } },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createMusicDto: CreateMusicDto,
    ) {
        if (!file) {
            throw new BadRequestException('Please upload a music file');
        }

        console.log('Raw categories:', createMusicDto.categories);

        if (typeof createMusicDto.categories === 'string') {
            try {
                createMusicDto.categories = JSON.parse(createMusicDto.categories);
            } catch (error) {
                throw new BadRequestException('Invalid categories format. Expected an array of numbers.');
            }
        }


        if (!Array.isArray(createMusicDto.categories)) {
            createMusicDto.categories = [createMusicDto.categories];
        }

        console.log('Processed categories:', createMusicDto.categories);

        return this.musicService.create(createMusicDto, file);
    }


    @Delete(':id')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Delete music' })
    async deleteMusic(@Param('id') id: number) {
        return this.musicService.delete(id)
    }


    @Post(':id')
    @ApiOperation({ summary: 'Update music' })
    @Roles(UserRoles.ADMIN)
     updateMusic(@Param('id') id: number, @Body() body: UpdateMusicDto) {
        return  this.musicService.update(id,body)
    }


}