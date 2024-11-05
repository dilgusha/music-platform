import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FollowService } from "./follow.service";
import { CreateFollowDto } from "./dto/create-follow.dto";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('follow')
@ApiTags('follow')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class FollowController {
    constructor(private followService: FollowService) { }

   
    @Post()
    createFollow(@Body() body: CreateFollowDto) {
        return this.followService.create(body)
    }


    @Delete('/remove/:userId')
    removeFollow(@Param('userId') userId: number) {
        return this.followService.removeFollow(userId)
    }


    @Delete('/unfollow/:userId')
    unfollow(@Param('userId') userId: number) {
        return this.followService.unFollow(userId)
    }
}