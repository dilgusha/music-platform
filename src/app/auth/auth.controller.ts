import { Body, Controller, Post } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    login(@Body() body: LoginUserDto) {
        return this.authService.login(body);
    }

    @Post('register')
    register(@Body() body: RegisterUserDto) {
        return this.authService.register(body);
    }
}