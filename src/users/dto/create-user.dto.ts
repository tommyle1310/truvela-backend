import { IsString, IsEnum, IsEmail, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { Enum_Gender, Enum_Role } from 'src/utils/enums';



export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    phone: string;

    @IsOptional()
    @IsEnum(Enum_Gender)
    gender: Enum_Gender;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsEnum(Enum_Gender)
    role: Enum_Role;

    @IsString()
    password: string;

    @IsOptional()
    @IsBoolean()
    is_verified: boolean;

    @IsOptional()
    @IsString()
    auth_provider: string;

    @IsOptional()
    @IsObject()
    preferences: object;

    @IsOptional()
    @IsObject()
    avatar: { url: string; key: string };

    @IsOptional()
    @IsString()
    nationality: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    date_of_birth: string; // Timestamp or ISO date string
}
