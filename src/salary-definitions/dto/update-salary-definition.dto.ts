import { PartialType } from '@nestjs/mapped-types';
import { CreateSalaryDefinitionDto } from './create-salary-definition.dto';
import { IsString, IsEnum, IsNumber, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Enum_Level } from 'src/utils/enums';


export class UpdateSalaryDefinitionDto extends PartialType(CreateSalaryDefinitionDto) {
    @IsOptional()
    @IsString()
    job_title?: string;

    @IsOptional()
    @IsEnum(Enum_Level)
    job_level?: Enum_Level;

    @IsOptional()
    @IsNumber()
    base_salary?: number;

    @IsOptional()
    @IsNumber()
    commission_percentage?: number;

    @IsOptional()
    @IsInt()
    updated_at?: number;
}
