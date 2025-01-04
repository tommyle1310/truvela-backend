import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
    @IsOptional()
    @IsString()
    id?: string; // Optional: Department ID, in case you want to update by ID

    @IsOptional()
    @IsString()
    name?: string; // Optional: Name of the department

    @IsOptional()
    @IsString()
    description?: string; // Optional: Description of the department

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    permissions?: string[]; // Optional: Array of permission IDs, e.g., [PER_1, PER_2]

    @IsOptional()
    @IsBoolean()
    is_active?: boolean; // Optional: Whether the department is active or not

    @IsOptional()
    @IsNumber()
    total_staffs?: number; // Optional: Total number of staff in the department
}
