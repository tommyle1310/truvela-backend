import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Enum_PayrollStatus } from 'src/utils/enums'; // Assuming Enum_PayrollStatus is defined elsewhere

export class CreatePayrollDto {
    @IsString()
    staff_id: string; // Staff ID for the employee

    @IsString()
    pay_period_start: string; // Pay period start date in ISO 8601 format

    @IsString()
    pay_period_end: string; // Pay period end date in ISO 8601 format

    @IsString()
    payment_date: string; // Payment date (e.g., "05/01/2025")

    @IsNumber()
    gross_salary: number; // Gross salary for the pay period

    @IsNumber()
    hourly_wage: number; // Hourly wage of the employee

    @IsNumber()
    base_salary: number; // Base salary

    @IsNumber()
    allowances: number; // Allowances

    @IsNumber()
    hours_worked: number; // Total hours worked

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

    @IsNumber()
    net_pay: number; // Net pay after deductions

    @IsNumber()
    leave_balance: number; // Leave balance available

    @IsEnum(Enum_PayrollStatus)
    status: Enum_PayrollStatus; // Status of payroll (Pending, Approved, etc.)

    @IsNumber()
    created_at: number; // Timestamp for creation

    @IsNumber()
    updated_at: number; // Timestamp for last update
}
