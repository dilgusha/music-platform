import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicDto } from './create-music.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMusicDto extends PartialType(CreateMusicDto) {
    @IsOptional()
    @ApiProperty()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Music duration' })
    @IsNumber()
    @Type(() => Number)
    duration?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber({}, { each: true })
    categories?: number[];

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    coverImage?: number;

    @ApiProperty()
    @IsOptional()
    @Type(() => Date)
    releaseDate?: Date;
}
