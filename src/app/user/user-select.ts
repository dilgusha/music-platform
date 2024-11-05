import { UserEntity } from "src/database/entities/User.entity";
import { FindOptionsSelect } from "typeorm";

export const USER_PROFILE_SELECT: FindOptionsSelect<UserEntity> = {
    id: true,
    userName: true,
    birthDate:true,
    email:true,
  
}

export const USER_PUBLIC_SELECT = {
    id:true,
    userName:true,
}