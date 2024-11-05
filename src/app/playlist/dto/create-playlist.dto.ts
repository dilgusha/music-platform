import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePlaylistDto {
    @Type()
    @ApiProperty({ description: 'Playlist name' })
    @IsString()
    playlistName: string;

    // @Type()
    // @ApiProperty()
    // @IsOptional()
    // @IsString()
    // description?: string;

}
