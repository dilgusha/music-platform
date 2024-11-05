import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "src/database/entities/Category.entity";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { ImageEntity } from "src/database/entities/Image.entity";


@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity,ImageEntity])],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService],
 
})

export class CategoryModule { }