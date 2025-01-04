import { IsString, IsEnum, IsArray, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { Enum_Level, Enum_Job_Type } from 'src/utils/enums'; // Assuming you have EnumLevel and EnumJobType enums defined.

export class CreateJobDto {
    @IsString()
    title: string; // Job title

    @IsString()
    description: string; // Job description

    @IsOptional()
    @IsString()
    department: string; // Department ID (e.g., DEP_1)

    @IsOptional()
    @IsNumber()
    posting_date: number; // Posting date (timestamp)

    @IsOptional()
    @IsNumber()
    closing_date: number; // Closing date (timestamp)

    @IsOptional()
    @IsEnum(['ACTIVE', 'INACTIVE'])
    status: 'ACTIVE' | 'INACTIVE'; // Job status

    @IsOptional()
    @IsArray()
    @IsString()
    skills_required: string; // Required skills, array of strings


    @IsOptional()
    @IsArray()
    @IsString()
    benefits: string; // List of benefits offered by the job

    @IsOptional()
    @IsArray()
    @IsEnum(Enum_Level, { each: true })
    level_needs: Enum_Level[]; // Job levels (EnumLevel)

    @IsOptional()
    @IsArray()
    @IsEnum(Enum_Job_Type, { each: true })
    job_type: Enum_Job_Type[]; // Job types (EnumJobType)
}
