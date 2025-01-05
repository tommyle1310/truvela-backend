import { PartialType } from '@nestjs/mapped-types';
import { CreateHrCandidateDto } from './create-hr-candidate.dto';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsPhoneNumber, IsEmail, IsInt } from 'class-validator';
import { Enum_CandidateStatus } from 'src/utils/enums';


export class UpdateHrCandidateDto extends PartialType(CreateHrCandidateDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    office_location: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsInt()
    @IsNotEmpty()
    applied_date: number; // Unix timestamp

    @IsOptional()
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
