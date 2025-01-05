import { PartialType } from '@nestjs/mapped-types';
import { CreateSpaDto } from './create-spa.dto';
import { IsString, IsArray, IsOptional, IsInt, IsObject } from 'class-validator';


export class UpdateSpaDto extends PartialType(CreateSpaDto) {
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    spa_manager?: string;

    @IsOptional()
    @IsInt()
    created_at?: number;

    @IsOptional()
    @IsInt()
    updated_at?: number;

    @IsOptional()
    @IsObject()
    avatar?: { url: string; key: string };

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tag?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    services_offer?: string[];


    @IsOptional()
    @IsString()
    spa_type: any;

    @IsOptional()
    @IsInt()
    capacity?: number;

    @IsOptional()
    @IsObject()
    location?: { lat: number, lon: number }

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    image_gallery?: string[];

    @IsOptional()
    @IsObject()
    operating_hours?: {
        mon: string;
        tue: string;
        wed: string;
        thu: string;
        fri: string;
        sat: string;
        sun: string;
    };
}
