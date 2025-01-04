import { IsString, IsEmail, IsOptional, IsEnum, IsArray, IsBoolean, IsObject } from 'class-validator';
import { Gender } from 'src/utils/enums';

export class CreateCustomerDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    phone: string;

    @IsObject()
    avatar: { url: string; key: string };

    @IsOptional()
    @IsString()
    date_of_birth: string; // Can be a timestamp or ISO date string

    @IsOptional()
    @IsEnum(Gender)
    gender: Gender;

    @IsOptional()
    @IsArray()
    service_category_preference: string[]; // Array of service category ids

    @IsOptional()
    @IsArray()
    therapist_id_preference: number[]; // Array of therapist ids

    @IsOptional()
    @IsBoolean()
    is_first_time: boolean; // Whether it's the user's first time

    @IsOptional()
    @IsString()
    loyalty_point: string; // Loyalty points (if applicable)
}
