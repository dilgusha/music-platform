import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsArray, ValidateNested } from "class-validator";
import { toArray } from "postgre";

export class CreateMusicDto {
    @ApiProperty({ description: 'Music name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Music duration' })
    @IsNumber()
    @Type(() => Number)
    duration: number;

    @Type(() => Number)
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

    @ApiProperty({  description: 'Music categories', required: false })
    @IsOptional()
    @Type(() => Number)
    categories: number[];

    // @ApiProperty({ description: 'List of category IDs', example: ['47b32970-4997-4364-91b6-4b5533941307', '620b7c84-6d63-492e-8abb-7606e04a375c'], required: false })
    // @IsArray()
    // categories?: string[];


    // @IsOptional()
    // @ValidateNested({ each: true })
    // @ApiProperty({
    //     type: Number,
    //     isArray: true,
    // })
    // categories: number[];

    // @IsOptional()
    // @IsArray()
    // @Transform(({ value }) => value.map((val: string | number) => parseInt(val, 10))) // String'i number'a dönüştür
    // @IsNumber({}, { each: true }) // Her bir değerin number olduğunu doğrula
    // categories: number[];


    // @IsOptional()
    // @Transform(({ value }) => Array.isArray(value) ? value.map(Number) : []) // Gelen array'i sayılara dönüştür
    // @IsArray()
    // @IsNumber({}, { each: true }) // Her bir değerin sayı olduğundan emin ol
    // categories: number[];
}
