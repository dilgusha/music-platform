// apply-for-artist.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class ApplyForArtistDto {
    // @IsNumber()
    // @IsNotEmpty()
    // userId: number;

    // @IsString()
    // @IsNotEmpty()
    // artistName: string;  // Sanatçı adı, Spotify for Artists gibi platformlarda yaygın bir gerekliliktir

    @ApiProperty({ description: 'Başvuru yapan kullanıcının ID numarası' })
    @IsNumber()
    userId: number;

    @ApiProperty({ description: 'Sanatçının biyografisi', required: false })
    @IsString()
    @IsOptional()
    biography?: string;

    @ApiProperty({ description: 'Sanatçının öne çıkan şarkıları', required: false, type: [String] })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    topTracks?: string[];  // Sanatçının öne çıkan şarkıları

    // @IsUrl()
    // @IsOptional()
    // website?: string;  // Sanatçının kişisel veya resmi web sitesi, isteğe bağlıdır

    // @IsArray()
    // @IsOptional()
    // @IsUrl()
    // socialLinks?: string[];  // Sosyal medya bağlantıları, isteğe bağlı ama doğrulama için faydalı

    // @IsString()
    // @IsOptional()
    // genre?: string;  // Sanatçının müzik tarzı veya türü
}
