import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffShiftDto } from './create-staff-shift.dto';
import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { ShiftType } from 'src/utils/enums';


export class UpdateStaffShiftDto extends PartialType(CreateStaffShiftDto) {
    @IsOptional()
    @IsString()
    shift_type?: ShiftType;

    @IsOptional()
    @IsString()
    shift_start?: string;

    @IsOptional()
    @IsString()
    shift_end?: string;

    @IsOptional()
    @IsInt()
    updated_at?: number;
}
