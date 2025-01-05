import { IsString, IsOptional, IsUrl, IsInt, IsObject, ValidateNested } from 'class-validator';

export class CreateServiceCategoryDto {
    @IsOptional()  // Auto-incremented ID will not be provided by the user
    @IsInt()
    id?: string;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsInt()
    created_at: number;

    @IsOptional()
    @IsInt()
    updated_at: number;

    @IsOptional()
    @IsObject()
    avatar: { url: string; key: string };
}
