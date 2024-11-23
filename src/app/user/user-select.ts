import { UserEntity } from "src/database/entities/User.entity";
import { FindOptionsSelect } from "typeorm";

// export const USER_PROFILE_SELECT: FindOptionsSelect<UserEntity> = {
//     id: true,
//     userName: true,
//     birthDate:true,
//     email:true,

// }

export const USER_PROFILE_SELECT: FindOptionsSelect<UserEntity> = {
    id: true,
    userName: true,
    followerCount: true,
    followedCount: true,
    playlists: { id: true, playlistName: true },
    profileImage: { id: true, url: true },
    artist: { id: true, artistName: true, albums: true }
}