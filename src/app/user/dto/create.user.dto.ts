import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsString, Length, MaxDate } from "class-validator";
import * as dateFns from 'date-fns';
import { Gender, UserRoles } from "src/shared/enum/user.enum";

export class CreateUserDto {
    @Type()
    @IsString()
    @Length(3, 30)
    @ApiProperty()
    userName: string;

    @Type()
    @IsEmail()
    @ApiProperty()
    email: string

    @Type()
    @IsString()
    @Length(3, 150)
    @ApiProperty()
    password: string;

    @Type()
    @IsDate()
    @MaxDate(() => dateFns.add(new Date(), { years: -13 }), {
        message: 'You are too young must be at least 13 years old',
    })
    @ApiProperty({ type: String, format: 'date' })
    birthDate: Date;


    @Type()
    @IsEnum(Gender)
    @ApiProperty({ enum: Gender })
    gender: Gender;

    @Type()
    @IsEnum(UserRoles, { each: true })
    @ApiProperty({ default: [UserRoles.USER] })
    roles: UserRoles[];
}