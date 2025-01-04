import { IsOptional, IsString, IsEnum, IsEmail, IsObject, IsBoolean } from 'class-validator';
import { Enum_Gender, Enum_Role } from 'src/utils/enums';


export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    first_name: string;

    @IsOptional()
    @IsString()
    last_name: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsEnum(Enum_Gender)
    gender: Enum_Gender;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsEnum(Enum_Role)
    role: Enum_Role;

    @IsOptional()
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
    date_of_birth: string;
}
