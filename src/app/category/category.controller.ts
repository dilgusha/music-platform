import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRoles } from "src/shared/enum/user.enum";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller('category')
@ApiTags('category')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Roles(UserRoles.ADMIN)

export class CategoryController {
    constructor(private categoryService: CategoryService) { }


    @Get()
    @ApiOperation({ summary: 'View categories' })
    findAll() {
        return this.categoryService.find()
    }

    // @Get(':id')
    // @ApiOperation({ summary: 'View Category' })
    // findOneCategory(@Param('id') id: number) {
    //     return this.categoryService.findOne({ where: { id } })
    // }

    @Post()
    @ApiOperation({ summary: 'Create Category' })
    create(@Body() body: CreateCategoryDto) {
        return this.categoryService.create(body)
    }

    @Post(':id')
    @ApiOperation({ summary: 'Update Category' })
    update(@Param('id') id: number, @Body() body: UpdateCategoryDto) {
        return this.categoryService.update(id, body)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Category' })
    delete(@Param('id') id: number) {
        return this.categoryService.delete(id)
    }
}