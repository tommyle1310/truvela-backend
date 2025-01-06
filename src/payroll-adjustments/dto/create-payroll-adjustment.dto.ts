import { IsString, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Enum_PayrollAdjustmentType } from 'src/utils/enums'; // Enum for adjustment types

export class CreatePayrollAdjustmentDto {
    @IsString()
    name: string; // Name of the payroll adjustment (e.g., Parking Fee)

    @IsEnum(Enum_PayrollAdjustmentType)
    type: Enum_PayrollAdjustmentType; // Type of the adjustment (BONUS, REIMBURSEMENT, etc.)

    @IsNumber()
    amount: number; // Amount of the payroll adjustment

    @IsString()
    description: string; // Description of the adjustment (e.g., Reason for the adjustment)

    @IsOptional()
    @IsNumber()
    created_at: number; // Timestamp for creation

    @IsOptional()
    @IsNumber()
    updated_at: number; // Timestamp for last update
}
