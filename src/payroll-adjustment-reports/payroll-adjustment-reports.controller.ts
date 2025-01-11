import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayrollAdjustmentReportsService } from './payroll-adjustment-reports.service';


import { CreatePayrollAdjustmentReportDto } from './dto/create-payroll-adjustment-report.dto';
import { UpdatePayrollAdjustmentReportDto } from './dto/update-payroll-adjustment-report.dto';

@Controller('payroll-adjustment-reports')
export class PayrollAdjustmentReportsController {
  constructor(private readonly payrollAdjustmentReportsService: PayrollAdjustmentReportsService) { }

  @Post()
  create(@Body() createPayrollAdjustmentReportDto: CreatePayrollAdjustmentReportDto) {
    return this.payrollAdjustmentReportsService.create(createPayrollAdjustmentReportDto);
  }

  @Get()
  findAll() {
    return this.payrollAdjustmentReportsService.findAll();
  }

  @Get('staffId/:staffId')
  async findAllByStaffId(@Param('staffId') staffId: string) {
    return await this.payrollAdjustmentReportsService.findAllByStaffId(staffId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollAdjustmentReportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayrollAdjustmentReportDto: UpdatePayrollAdjustmentReportDto) {
    return this.payrollAdjustmentReportsService.update(id, updatePayrollAdjustmentReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollAdjustmentReportsService.remove(id);
  }
}
