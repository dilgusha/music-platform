import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateCategoryDto {
    @Type()
    @ApiProperty()
    @IsString()
    @Length(3, 50)
    categoryName: string;

    @Type()
    @ApiProperty()
    @IsString()
    @Length(10, 200)
    description: string

    @ApiProperty({ required: false })
    @IsNumber()
    categoryCoverImageId: number;
}