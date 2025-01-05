import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { Enum_ShiftType } from 'src/utils/enums';



export class CreateStaffShiftDto {
    @IsOptional()
    @IsString()
    id: string;

    @IsString()
    shift_type: Enum_ShiftType;

    @IsString()
    shift_start: string;

    @IsString()
    shift_end: string;

    @IsOptional()
    @IsInt()
    created_at?: number;

    @IsOptional()
    @IsInt()
    updated_at?: number;
}