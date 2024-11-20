import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {IsEnum, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "src/shared/enum/user.enum";

export class UpdateUserDto {
    @Type()
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    profileImage: number;

    @Type()
    @IsString()
    @Length(3, 30)
    @ApiProperty()
    @IsOptional()
    userName?: string;
}