import { IsOptional, IsString, IsEnum, IsEmail, IsObject, IsBoolean } from 'class-validator';
import { Gender, Role } from 'src/utils/enums';


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
    @IsEnum(Gender)
    gender: Gender;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsEnum(Role)
    role: Role;

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
