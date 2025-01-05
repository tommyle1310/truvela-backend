import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsUrl, IsInt, IsObject, ValidateNested } from 'class-validator';
import { CreateServiceCategoryDto } from './create-service-category.dto';
import { Type } from 'class-transformer';


export class UpdateServiceCategoryDto extends PartialType(CreateServiceCategoryDto) {
    @IsOptional()
    @IsInt()
    id?: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsInt()
    created_at: number;

    @IsInt()
    updated_at: number;

    @IsOptional()
    @IsObject()
    avatar: { url: string; key: string };
}
