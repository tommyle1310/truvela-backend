import { IsString, IsEnum, IsEmail, IsOptional, IsNumber, IsDateString, IsBoolean, IsObject, IsArray } from 'class-validator';
import { Enum_Gender, Enum_Level } from 'src/utils/enums'; // Assuming you have EnumLevel defined

export class CreateStaffDto {
    @IsOptional()
    @IsString()
    id?: string; // Staff first name

    @IsString()
    first_name: string; // Staff first name

    @IsString()
    last_name: string; // Staff last name

    @IsOptional()
    @IsString()
    phone: string; // Staff phone number

    @IsOptional()
    @IsEmail()
    email: string; // Staff email

    @IsOptional()
    @IsEnum(Enum_Gender)
    gender: Enum_Gender; // Gender

    @IsOptional()
    @IsString()
    address: string

    @IsOptional()
    @IsNumber()
    date_of_birth: number; // Date of birth as timestamp

    @IsOptional()
    @IsNumber()
    active_points: number;

    @IsOptional()
    @IsObject()
    avatar: { url: string; key: string }; // Avatar image (with URL and key)

    @IsOptional()
    @IsString()
    department: string; // Department ID (e.g., DEP_1)

    @IsOptional()
    @IsString()
    job: string; // Job ID (e.g., JOB_1)

    @IsOptional()
    @IsBoolean()
    is_fulltime: boolean; // Whether the staff member is full-time or not

    @IsOptional()
    @IsNumber()
    violation_count: number; // Number of violations

    @IsOptional()
    @IsString()
    work_office: string; // Office location, if applicable

    @IsOptional()
    @IsBoolean()
    is_active: boolean; // Whether the staff member is active or not

    @IsOptional()
    @IsNumber()
    joining_date: number; // Joining date as timestamp

    @IsOptional()
    @IsNumber()
    total_days_worked: number; // Total days worked

    @IsOptional()
    @IsEnum(Enum_Level)
    level: Enum_Level; // Staff level (e.g., JUNIOR, SENIOR, etc.)

    @IsOptional()
    @IsString()
    account_access: string[]; // List of account accesses (permissions or roles)

    @IsOptional()
    @IsNumber()
    created_at: number; // Timestamp for creation

    @IsOptional()
    @IsNumber()
    updated_at: number; // Timestamp for last update
}
