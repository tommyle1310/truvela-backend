import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OvertimeReportsService } from './overtime-reports.service';
import { CreateOvertimeReportDto } from './dto/create-overtime-report.dto';
import { UpdateOvertimeReportDto } from './dto/update-overtime-report.dto';

@Controller('overtime-reports')
export class OvertimeReportsController {
  constructor(private readonly overtimeReportsService: OvertimeReportsService) { }

  @Post()
  create(@Body() createOvertimeReportDto: CreateOvertimeReportDto) {
    return this.overtimeReportsService.create(createOvertimeReportDto);
  }

  @Get()
  findAll() {
    return this.overtimeReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.overtimeReportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOvertimeReportDto: UpdateOvertimeReportDto) {
    return this.overtimeReportsService.update(id, updateOvertimeReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.overtimeReportsService.remove(id);
  }
}
