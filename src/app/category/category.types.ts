import { CategoryEntity, CategoryKey } from "src/database/entities/Category.entity";
import { FindOptionsWhere } from "typeorm";

export interface FindCategoryParams {
    where?: FindOptionsWhere<CategoryEntity>,
    select?: CategoryKey[],
    relations?: string[],
    filter?: {
        name?: string
    };
    pagination?: {
        limit: number,
        page: number
    }
}