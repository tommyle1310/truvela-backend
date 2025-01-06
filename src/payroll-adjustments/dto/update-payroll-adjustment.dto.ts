import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollAdjustmentDto } from './create-payroll-adjustment.dto';
import { IsString, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Enum_PayrollAdjustmentType } from 'src/utils/enums';

export class UpdatePayrollAdjustmentDto extends PartialType(CreatePayrollAdjustmentDto) {
    @IsOptional()
    @IsString()
    name: string; // Name of the payroll adjustment (e.g., Parking Fee)

    @IsOptional()
    @IsEnum(Enum_PayrollAdjustmentType)
    type: Enum_PayrollAdjustmentType; // Type of the adjustment (BONUS, REIMBURSEMENT, etc.)

    @IsOptional()
    @IsNumber()
    amount: number; // Amount of the payroll adjustment

    @IsOptional()
    @IsString()
    description: string; // Description of the adjustment (e.g., Reason for the adjustment)

    @IsOptional()
    @IsNumber()
    created_at: number; // Timestamp for creation

    @IsOptional()
    @IsNumber()
    updated_at: number; // Timestamp for last update
}
