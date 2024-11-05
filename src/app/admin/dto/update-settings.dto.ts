import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from "class-validator";

export class UpdateSettingsDto {
    @Type()
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    logoId?: number;

    @Type()
    @ApiProperty()
    @IsString()
    @Length(3, 30)
    sitename?: string;

    @Type()
    @ApiProperty()
    @IsString()
    @Length(10, 700)
    aboutUs?: string;

    @Type()
    @ApiProperty({ description: 'Phone number in the format +994 50 123 45 67' })
    @IsString()
    @Matches(/^\+\d{3} \d{2} \d{3} \d{2} \d{2}$/, { message: 'Phone number must be in the format +994 50 123 45 67' })
    phone?: string;

    @Type()
    @ApiProperty({ description: 'Primary email address' })
    @IsEmail()
    email?: string;

    @Type()
    @ApiProperty({ description: 'Instagram URL' })
    @IsOptional()
    @IsString()
    @Length(10, 100)
    instaUrl?: string;

    @Type()
    @ApiProperty({ description: 'Facebook URL' })
    @IsOptional()
    @IsString()
    @Length(10, 100)
    facebookUrl?: string;

    @Type()
    @ApiProperty({ description: 'Twitter URL' })
    @IsOptional()
    @IsString()
    @Length(10, 100)
    twitterUrl?: string;
}