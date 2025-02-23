import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreatePayrollAdjustmentReportDto {
    @IsString()
    staff_id: string; // Staff ID for the employee

    @IsNumber()
    date: number; // Date of the payroll adjustment report (timestamp)

    @IsOptional()
    @IsString()
    notes: string; // Notes related to the payroll adjustment report

    @IsOptional()
    @IsString()
    payroll_adjustment: string; // Array of payroll adjustment IDs (e.g., PRA_1)

    @IsOptional()
    @IsString()
    overtime_report: string; // Array of payroll adjustment IDs (e.g., OR_1)

}
