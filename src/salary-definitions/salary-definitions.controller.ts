import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalaryDefinitionsService } from './salary-definitions.service';
import { CreateSalaryDefinitionDto } from './dto/create-salary-definition.dto';
import { UpdateSalaryDefinitionDto } from './dto/update-salary-definition.dto';

@Controller('salary-definitions')
export class SalaryDefinitionsController {
  constructor(private readonly salaryDefinitionsService: SalaryDefinitionsService) { }

  @Post()
  create(@Body() createSalaryDefinitionDto: CreateSalaryDefinitionDto) {
    return this.salaryDefinitionsService.create(createSalaryDefinitionDto);
  }

  @Get()
  findAll() {
    return this.salaryDefinitionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryDefinitionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryDefinitionDto: UpdateSalaryDefinitionDto) {
    return this.salaryDefinitionsService.update(id, updateSalaryDefinitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryDefinitionsService.remove(id);
  }
}
