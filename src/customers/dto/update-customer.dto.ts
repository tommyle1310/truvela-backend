import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsString, IsEmail, IsOptional, IsEnum, IsArray, IsBoolean, IsObject } from 'class-validator';
import { Enum_Gender } from 'src/utils/enums';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsObject()
    avatar?: { url: string; key: string };

    @IsOptional()
    @IsString()
    date_of_birth?: string; // Can be a timestamp or ISO date string

    @IsOptional()
    @IsEnum(Enum_Gender)
    gender?: Enum_Gender;

    @IsOptional()
    @IsArray()
    service_category_preference?: string[]; // Array of service category ids

    @IsOptional()
    @IsArray()
    therapist_id_preference?: number[]; // Array of therapist ids

    @IsOptional()
    @IsBoolean()
    is_first_time?: boolean; // Whether it's the user's first time

    @IsOptional()
    @IsString()
    loyalty_point?: string; // Loyalty points (if applicable)
}
