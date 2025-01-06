import { PartialType } from '@nestjs/mapped-types';
import { CreateMonthlyStaffAvailabilityDto } from './create-monthly-staff-schedule.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateMonthlyStaffAvailabilityDto extends PartialType(CreateMonthlyStaffAvailabilityDto) {
    // Staff ID field (e.g., STF_1, STF_2, etc.)
    @IsOptional()
    @IsString()
    staff_id: string;

    // Month for availability (e.g., 12/2024)
    @IsOptional()
    @IsString()
    month: string;

    // List of daily availability IDs (e.g., [DSTFA_1])
    @IsOptional()
    @IsArray()
    days: string[];

    // Notes (e.g., first month intern, etc.)
    @IsOptional()
    @IsString()
    note?: string;
}
