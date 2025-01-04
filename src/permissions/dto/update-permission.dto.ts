import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsString, IsOptional } from 'class-validator';


export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    @IsOptional()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
