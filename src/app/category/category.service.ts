import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { FindCategoryParams } from "./category.types";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ImageEntity } from "src/database/entities/Image.entity";
import { CategoryEntity } from "src/database/entities/category.entity";
import { UserEntity } from "src/database/entities/User.entity";
import { ClsService } from "nestjs-cls";
import { UserRoles } from "src/shared/enum/user.enum";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { UploadService } from "../upload/upload.service";

@Injectable()

export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
    private uploadService: UploadService,
    // @InjectRepository(ImageEntity)
    // private imageRepo: Repository<ImageEntity>,
    private cls: ClsService
  ) { }

  async find(params?: FindCategoryParams) {
    const myUser = await this.cls.get<UserEntity>('user')
    if (!myUser.roles || !myUser.roles.includes(UserRoles.ADMIN)) throw new ForbiddenException('Only admins can view all categories')

    const { where, select, relations } = params || {};
    return this.categoryRepo.find({
      where, select, relations
    })
  }

  async findOne(params: FindCategoryParams) {
    const { where, select } = params || {};
    return this.categoryRepo.findOne({
      where, select
    })
  }

  findByIds(ids: number[]) {
    return this.categoryRepo.findBy({ id: In(ids) })
  }

  async create(params: CreateCategoryDto) {
    const myUser = await this.cls.get<UserEntity>('user')

    if (!myUser) throw new NotFoundException('User not found')

    if (!myUser.roles || !myUser.roles.includes(UserRoles.ADMIN)) throw new ForbiddenException('Only admins can create categories')

    if (params.categoryCoverImageId) {
      const existingCategory = await this.categoryRepo.findOne({
        where: { categoryCoverImage: { id: params.categoryCoverImageId } },
      });
      if (existingCategory) {
        throw new BadRequestException('This cover image is already used by another category.');
      }
    }
    const existingCategory = await this.categoryRepo.findOne({
      where: { categoryName: params.categoryName }
    });

    if (existingCategory) {
      throw new ConflictException('This category already exists');
    }

    const category = this.categoryRepo.create(params);

    if (params.categoryCoverImageId) {
      const image = await this.uploadService.findImageById(params.categoryCoverImageId);
      if (image) {
        category.categoryCoverImage = image;
      } else {
        throw new NotFoundException('Image not found');
      }
    }
    await this.categoryRepo.save(category);
    return category;
  }




  async update(id: number, params: UpdateCategoryDto) {
    const myUser = this.cls.get<UserEntity>('user');

    if (!myUser) throw new NotFoundException('User not found');

    if (!myUser.roles || !myUser.roles.includes(UserRoles.ADMIN)) {
      throw new ForbiddenException('Only admins can update categories');
    }

    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    let payload: Partial<CategoryEntity> = { ...params };

    if (params.categoryCoverImageId) {
      const image = await this.uploadService.findImageById(params.categoryCoverImageId);
      if (!image) {
        throw new NotFoundException('Image not found');
      }
      payload.categoryCoverImage = image;
    }

    Object.assign(category, payload);
    await this.categoryRepo.save(category);

    return {
      status: true,
      message: 'Category updated successfully'
    };
  }


  // async updateCategory(id: number, params: UpdateCategoryDto) {
  //   const myUser = this.cls.get<UserEntity>('user')

  //   if (!myUser) throw new NotFoundException('User not found')

  //   if (!myUser.roles || !myUser.roles.includes(UserRoles.ADMIN)) throw new ForbiddenException('Only admins can update categories')

  //   const category = await this.categoryRepo.findOne({ where: { id } });
  //   if (!category) {
  //     throw new NotFoundException('Category not found');
  //   }
  //   let payload: Partial<CategoryEntity> = { ...params }

  //   if (params.categoryCoverImageId) {
  //     const image = await this.imageRepo.findOne({ where: { id: params.categoryCoverImageId } });
  //     if (!image) {
  //         throw new NotFoundException('Image not found');
  //     }
  //     category.categoryCoverImage = image;
  //     // Exclude categoryCoverImageId from payload since it's not a valid property in CategoryEntity
  //     // delete payload.categoryCoverImageId;
  // }

  //   await this.categoryRepo.save({ ...payload, ...category });
  //   // await this.categoryRepo.update(id, payload);
  //   // await this.update(myUser.id, payload)

  //   return {
  //     status: true,
  //     message: 'Category updated successfully'
  //   }
  // }

  // async update(id: number, params: Partial<CategoryEntity>) {
  //   return await this.categoryRepo.update({ id }, params);
  // }


  async delete(id: number) {
    const myUser = await this.cls.get<UserEntity>('user')

    if (!myUser) throw new NotFoundException('User not found')

    if (!myUser.roles || !myUser.roles.includes(UserRoles.ADMIN)) throw new ForbiddenException('Only admins can delete categories')

    let result = await this.categoryRepo.delete({ id })
    if (result.affected === 0) throw new NotFoundException()
    return {
      message: 'Category deleted successfully'
    }
  }

}