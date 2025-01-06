import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollAdjustmentReportDto } from './create-payroll-adjustment-report.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePayrollAdjustmentReportDto extends PartialType(CreatePayrollAdjustmentReportDto) {
    @IsOptional()
    @IsString()
    staff_id: string; // Staff ID for the employee

    @IsOptional()
    @IsNumber()
    date: number; // Date of the payroll adjustment report (timestamp)

    @IsOptional()
    @IsString()
    notes: string; // Notes related to the payroll adjustment report

    @IsOptional()
    @IsArray()
    payroll_adjustments: string[]; // Array of payroll adjustment IDs (e.g., [PRA_1, PRA_2])
}