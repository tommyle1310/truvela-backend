import { PartialType } from '@nestjs/mapped-types';
import { CreateOvertimeReportDto } from './create-overtime-report.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOvertimeReportDto extends PartialType(CreateOvertimeReportDto) {
    @IsOptional()
    @IsString()
    staff_id: string; // Staff ID for the employee

    @IsOptional()
    @IsNumber()
    date: number; // Timestamp of the date for which overtime is reported

    @IsOptional()
    @IsNumber()
    overtime_hour: number; // Number of overtime hours worked

    @IsOptional()
    @IsNumber()
    created_at?: number; // Timestamp for creation (defaults to current time)

    @IsOptional()
    @IsNumber()
    updated_at?: number; // Timestamp for last update (defaults to current time)
}
