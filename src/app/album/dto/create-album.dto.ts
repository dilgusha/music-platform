import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAlbumDto {
    @Type()
    @ApiProperty({ description: 'Album name' })
    @IsString()
    albumName: string

    @Type()
    @IsOptional()
    @ApiProperty()
    @IsDateString()
    releaseDate?: Date;

    @Type(()=> Number)
    @ApiProperty({ description: 'Cover Image ID', required: false })
    @IsNumber()
    @IsOptional()
    coverImage?: number;
}