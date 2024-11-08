import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsArray } from "class-validator";

export class CreateMusicDto {
    @ApiProperty({ description: 'Music name' })
    @IsString()
    name: string;

    // @ApiProperty({
    //     type: 'string',
    //     format: 'binary',
    //     description: 'Upload the audio file'
    // })
    // track: any;

    @ApiProperty({ description: 'Music duration' })
    @IsNumber()
    @Type(() => Number)
    duration: number;

    @Type(()=> Number)
    @ApiProperty({ description: 'Cover Image ID', required: false })
    @IsNumber()
    @IsOptional()
    coverImageId?: number;

    @ApiProperty({ description: 'Music release date', required: false })
    @IsOptional()
    @Type(() => Date)
    releaseDate?: Date;

    @ApiProperty({ description: 'Music description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    // @Type()
    // @IsNumber({}, { each: true })
    // @IsOptional()
    // @ApiProperty({ type: Number, isArray: true })
    // categories: number[];

    @ApiProperty({ type: [Number], description: 'Music categories', required: false })
    @IsOptional()
    @Type(() => Number)
    categories: number[];


}
