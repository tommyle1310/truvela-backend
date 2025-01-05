import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyAttendanceDto } from './create-daily-attendance.dto';
import { AttendanceStatus } from 'src/utils/enums';
import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';


export class UpdateDailyAttendanceDto extends PartialType(CreateDailyAttendanceDto) {
    @IsOptional()
    @IsString()
    id?: string;

    @IsString()
    @IsOptional()
    staff_id?: string; // Staff ID (Optional for updates)

    @IsInt()
    @IsOptional()
    date?: number; // Timestamp for the date (Optional for updates)

    @IsString()
    @IsOptional()
    clock_in?: string; // Clock in time (Optional for updates)

    @IsString()
    @IsOptional()
    clock_out?: string; // Clock out time (Optional for updates)

    @IsString()
    @IsOptional()
    check_in?: string; // Optional: Check-in time (Optional for updates)

    @IsString()
    @IsOptional()
    check_out?: string; // Optional: Check-out time (Optional for updates)

    @IsEnum(AttendanceStatus)
    @IsOptional()
    status_clock_in?: AttendanceStatus; // Status of the clock-in (Optional for updates)

    @IsEnum(AttendanceStatus)
    @IsOptional()
    status_clock_out?: AttendanceStatus; // Status of the clock-out (Optional for updates)
}
