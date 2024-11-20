import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateALbumDto {
    @Type()
    @ApiProperty()
    @IsOptional()
    @IsString()
    albumName?: string;

    @Type()
    @IsOptional()
    @ApiProperty()
    @IsDateString()
    releaseDate?: Date;

    @ApiProperty()
    @Type()
    @IsOptional()
    coverImage?: number; 
}