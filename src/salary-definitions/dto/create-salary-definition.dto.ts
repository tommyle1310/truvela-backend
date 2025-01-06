import { IsString, IsEnum, IsNumber, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Enum_Level } from 'src/utils/enums';


export class CreateSalaryDefinitionDto {
    @IsString()
    job_title: string;

    @IsEnum(Enum_Level)
    job_level: Enum_Level;

    @IsNumber()
    @Min(0)
    base_salary: number;

    @IsNumber()
    @Min(0)
    commission_percentage: number;

    @IsOptional()
    @IsInt()
    created_at: number;

    @IsOptional()
    @IsInt()
    updated_at: number;
}
