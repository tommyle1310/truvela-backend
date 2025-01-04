import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {


    @IsString()
    name: string;

    @IsString()
    description: string;
}
