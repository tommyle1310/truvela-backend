import { IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class CreateOvertimeReportDto {
    @IsString()
    staff_id: string; // Staff ID for the employee

    @IsNumber()
    date: number; // Timestamp of the date for which overtime is reported

    @IsNumber()
    overtime_hour: number; // Number of overtime hours worked

    @IsOptional()
    @IsNumber()
    created_at?: number; // Timestamp for creation (defaults to current time)

    @IsOptional()
    @IsNumber()
    updated_at?: number; // Timestamp for last update (defaults to current time)
}
