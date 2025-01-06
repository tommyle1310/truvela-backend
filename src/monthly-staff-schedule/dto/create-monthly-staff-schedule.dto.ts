import { IsString, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateMonthlyStaffAvailabilityDto {
    // Staff ID field (e.g., STF_1, STF_2, etc.)
    @IsString()
    staff_id: string;

    // Month for availability (e.g., 12/2024)
    @IsString()
    month: string;

    // List of daily availability IDs (e.g., [DSTFA_1])
    @IsArray()
    days: string[];

    // Notes (e.g., first month intern, etc.)
    @IsOptional()
    @IsString()
    note?: string;
}
