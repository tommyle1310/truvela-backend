import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsString, IsEnum, IsArray, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { Enum_Job_Type, Enum_Level } from 'src/utils/enums';

export class UpdateJobDto extends PartialType(CreateJobDto) {
    @IsOptional()
    @IsString()
    title: string; // Job title

    @IsOptional()
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
    @IsString()
    skills_required: string; // Required skills, array of strings


    @IsOptional()
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
