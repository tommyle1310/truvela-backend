import { IsString, IsEnum, IsEmail, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { Gender, Role } from 'src/utils/enums';



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
    @IsEnum(Gender)
    gender: Gender;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsEnum(Role)
    role: Role;

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
