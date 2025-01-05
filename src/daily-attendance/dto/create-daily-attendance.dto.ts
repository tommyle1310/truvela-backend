import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { Enum_AttendanceStatus } from 'src/utils/enums';



export class CreateDailyAttendanceDto {
    @IsString()
    staff_id: string; // ID of the staff member

    @IsInt()
    date: number; // Timestamp (could be in seconds, representing the attendance date)

    @IsString()
    clock_in: string; // Clock in time in HH:MM format

    @IsString()
    clock_out: string; // Clock out time in HH:MM format

    @IsString()
    @IsOptional()
    check_in?: string; // Optional: Check-in time (could be empty if not applicable)

    @IsString()
    @IsOptional()
    check_out?: string; // Optional: Check-out time (could be empty if not applicable)

    @IsEnum(Enum_AttendanceStatus)
    status_clock_in: Enum_AttendanceStatus; // Status of the clock-in (e.g., ON_TIME, LATE)

    @IsEnum(Enum_AttendanceStatus)
    status_clock_out: Enum_AttendanceStatus; // Status of the clock-out (e.g., ON_TIME, LATE)
}
