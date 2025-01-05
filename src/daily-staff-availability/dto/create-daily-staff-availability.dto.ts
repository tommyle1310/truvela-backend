// create-daily-staff-availability.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum, IsObject } from 'class-validator';
import { Enum_CandidateStatus, Enum_DailyStaffAvailabilityStatus } from 'src/utils/enums';

export class CreateDailyStaffAvailabilityDto {
    @IsString()
    staff_id: string;

    @IsString()
    date: string;

    @IsEnum(Enum_DailyStaffAvailabilityStatus)
    status: Enum_DailyStaffAvailabilityStatus;

    @IsString()
    shift: string;

    @IsOptional()
    @IsObject()
    blocked_time?: {
        from: number;
        to: number;
    };

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsNumber()
    attended_hours?: number;
}
