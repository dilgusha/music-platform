// update-playlist.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePlaylistDto {
    @Type()
    @ApiProperty()
    @IsOptional()
    @IsString()
    playlistName?: string;

    @Type()
    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @Type()
    @ApiProperty()
    @IsOptional()
    @IsString()
    coverImage?:number
}
