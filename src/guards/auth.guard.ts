import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClsService } from "nestjs-cls";
import { UserService } from "src/app/user/user.service";
import { UserRoles } from "src/shared/enum/user.enum";
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private cls: ClsService,
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid or missing authorization header');
        }

        const token = authHeader.split(' ')[1];
        try {
            const payload = await this.jwtService.verify(token);
            if (!payload.userId) throw new UnauthorizedException('Invalid token payload');

            const user = await this.userService.findOne({ where: { id: payload.userId } });
            if (!user) throw new UnauthorizedException('User not found');

            this.cls.set('user', user);
            // req.user = user;
            // console.log('Authenticated User:', user);


            const roles = this.reflector.get<UserRoles[]>('roles', context.getHandler());
            if (roles && roles.length > 0) {
                const hasRole = roles.some((role) => user.roles?.includes(role));
                if (!hasRole) {
                    throw new ForbiddenException('You do not have permission to access this resource');
                }
            }
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new UnauthorizedException('Authentication failed');
        }

        return true;
    }
}
