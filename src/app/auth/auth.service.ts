import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserRoles } from "src/shared/enum/user.enum";
import { log } from "console";


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService, 
        private jwtService: JwtService
    ) { }

    async login(params: LoginUserDto) {
        let user = await this.userService.findOne({
            where: [
                { userName: params.userName },
                { password: params.password }
            ]
        })

        if (!user) throw new HttpException(
            'username or password is wrong',
            HttpStatus.BAD_REQUEST,
        );
        let checkPassword = await bcrypt.compare(params.password, user.password);

        if (!checkPassword) throw new HttpException(
            'username or password is wrong',
            HttpStatus.BAD_REQUEST,
        );

        let payload = {
            userId: user.id,
        };

        
        
        let token = this.jwtService.sign(payload);
        return {
            token,
            user,
        };
        
        console.log(token);
    }

    async register(params: RegisterUserDto) {
        let user = await this.userService.create({ ...params, roles: [UserRoles.USER] });
        return user;
    }
}