import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayrollAdjustmentsService } from './payroll-adjustments.service';
import { CreatePayrollAdjustmentDto } from './dto/create-payroll-adjustment.dto';
import { UpdatePayrollAdjustmentDto } from './dto/update-payroll-adjustment.dto';

@Controller('payroll-adjustments')
export class PayrollAdjustmentsController {
  constructor(private readonly payrollAdjustmentsService: PayrollAdjustmentsService) { }

  @Post()
  create(@Body() createPayrollAdjustmentDto: CreatePayrollAdjustmentDto) {
    return this.payrollAdjustmentsService.create(createPayrollAdjustmentDto);
  }

  @Get()
  findAll() {
    return this.payrollAdjustmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollAdjustmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayrollAdjustmentDto: UpdatePayrollAdjustmentDto) {
    return this.payrollAdjustmentsService.update(id, updatePayrollAdjustmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollAdjustmentsService.remove(id);
  }
}
