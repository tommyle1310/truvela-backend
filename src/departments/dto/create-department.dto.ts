import { IsArray, IsBoolean, IsNumber, IsString, IsOptional, ArrayNotEmpty } from 'class-validator';

export class CreateDepartmentDto {
    @IsOptional()
    @IsString()
    id: string; // The department ID, e.g., 'DEP_1'

    @IsString()
    name: string; // Name of the department, e.g., 'therapist'

    @IsString()
    description: string; // Description of the department, e.g., 'Man who is in charge of the app's running'

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    permissions: string[]; // Array of permission IDs, e.g., [PER_1, PER_2]

    @IsOptional()
    @IsBoolean()
    is_active: boolean; // Whether the department is active or not

    @IsOptional()
    @IsNumber()
    total_staffs: number; // Total number of staff in the department
}
