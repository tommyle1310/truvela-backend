import { IsString, IsNotEmpty, IsEnum, IsOptional, IsPhoneNumber, IsEmail, IsInt } from 'class-validator';
import { Enum_CandidateStatus } from 'src/utils/enums';



export class CreateHrCandidateDto {
    @IsString()
    @IsNotEmpty()
    office_location: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    applied_date: number; // Unix timestamp

    @IsString()
    @IsNotEmpty()
    applied_for: string;

    @IsOptional()
    @IsNotEmpty()
    phone: string;

    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsEnum(Enum_CandidateStatus)
    @IsNotEmpty()
    status: Enum_CandidateStatus;

    @IsString()
    @IsOptional()
    source?: string;

    @IsString()
    @IsOptional()
    resume?: string;
}
