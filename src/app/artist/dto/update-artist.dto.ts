// update-artist.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UpdateArtistDto {
    @ApiProperty({ description: 'Artist Name', required: true })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    artistName?: string;

    @ApiProperty({ description: 'Artist Bio', required: false })
    @IsString()
    @IsOptional()
    biography?: string;

    @ApiProperty({ description: 'Artist song ids', required: false, type: [Number] })
    @IsOptional()
    @IsNumber({}, { each: true })
    topTracks?: number[];

    @ApiProperty({ description: 'Artist social media links', required: false })
    @IsArray()
    @IsOptional()
    socialLinks?: string[];

    @ApiProperty({ description: 'Artist song genre', required: false })
    @IsString()
    @IsOptional()
    genre?: string;
}
