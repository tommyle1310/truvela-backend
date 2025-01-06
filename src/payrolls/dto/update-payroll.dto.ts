import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Enum_PayrollStatus } from 'src/utils/enums'; // Assuming Enum_PayrollStatus is defined elsewhere
import { CreatePayrollDto } from './create-payroll.dto';

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {
    @IsOptional()
    @IsString()
    staff_id: string; // Staff ID for the employee

    @IsOptional()
    @IsString()
    pay_period_start: string; // Pay period start date in ISO 8601 format

    @IsOptional()
    @IsString()
    pay_period_end: string; // Pay period end date in ISO 8601 format

    @IsOptional()
    @IsString()
    payment_date: string; // Payment date (e.g., "05/01/2025")

    @IsOptional()
    @IsNumber()
    gross_salary: number; // Gross salary for the pay period

    @IsOptional()
    @IsNumber()
    hourly_wage: number; // Hourly wage of the employee

    @IsOptional()
    @IsNumber()
    base_salary: number; // Base salary

    @IsOptional()
    @IsNumber()
    allowances: number; // Allowances

    @IsOptional()
    @IsNumber()
    hours_worked: number; // Total hours worked

    @IsOptional()
    @IsNumber()
    overtime_hours: number; // Overtime hours worked

    @IsOptional()
    @IsNumber()
    overtime_pay: number; // Pay for overtime

    @IsOptional()
    @IsNumber()
    bonus_amount: number; // Bonus amount

    @IsOptional()
    @IsNumber()
    reimbursement_amount: number; // Reimbursement amount

    @IsOptional()
    @IsNumber()
    benefit_amount: number; // Benefit amount

    @IsOptional()
    @IsNumber()
    operation_deduction_amount: number; // Operational deduction

    @IsOptional()
    @IsNumber()
    other_deduction_amount: number; // Other deductions

    @IsOptional()
    @IsNumber()
    tax: number; // Tax

    @IsOptional()
    @IsNumber()
    extra_pay: number; // Extra pay

    @IsOptional()
    @IsString()
    notes?: string; // Notes related to payroll

    @IsOptional()
    @IsNumber()
    net_pay: number; // Net pay after deductions

    @IsOptional()
    @IsNumber()
    leave_balance: number; // Leave balance available

    @IsOptional()
    @IsEnum(Enum_PayrollStatus)
    status: Enum_PayrollStatus; // Status of payroll (Pending, Approved, etc.)

    @IsOptional()
    @IsNumber()
    created_at: number; // Timestamp for creation

    @IsOptional()
    @IsNumber()
    updated_at: number; // Timestamp for last update
}
