import { IsString, IsArray, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Enum_WeekDays } from 'src/utils/enums';


// DTO for creating weekly staff availability
export class CreateWeeklyStaffAvailabilityDto {
    // Staff ID field (e.g., STF_1, STF_2, etc.)
    @IsOptional()
    @IsString()
    staff_id: string;

    // Shifts for each day of the week. Can be a single shift ID, an array of shift IDs, or null
    @IsOptional()
    days: {
        mon: string | null | string[],
        tue: string | null | string[],
        wed: string | null | string[],
        thu: string | null | string[],
        fri: string | null | string[],
        sat: string | null | string[],
        sun: string | null | string[]
    };

    // Start date of the week (in dd/mm/yyyy format)
    @IsDateString()
    week_start_date: string;

    // Notes (e.g., late arrival due to sickness)
    @IsString()
    @IsOptional()
    note?: string;
}
