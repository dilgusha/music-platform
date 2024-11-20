import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class UpdateCategoryDto {
    @Type()
    @ApiProperty()
    @IsString()
    @Length(3, 50)
    @IsOptional()
    categoryName?: string;

    @Type()
    @ApiProperty()
    @IsString()
    @IsOptional()
    @Length(10, 200)
    description?: string

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    categoryCoverImage?: number;
}