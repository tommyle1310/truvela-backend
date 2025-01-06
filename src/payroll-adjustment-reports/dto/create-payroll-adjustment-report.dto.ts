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
    @IsArray()
    payroll_adjustments: string[]; // Array of payroll adjustment IDs (e.g., [PRA_1, PRA_2])
}
