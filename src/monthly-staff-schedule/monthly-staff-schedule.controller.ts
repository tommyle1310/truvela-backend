import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonthlyStaffAvailabilityService } from './monthly-staff-schedule.service';
import { CreateMonthlyStaffAvailabilityDto } from './dto/create-monthly-staff-schedule.dto';
import { UpdateMonthlyStaffAvailabilityDto } from './dto/update-monthly-staff-schedule.dto';

@Controller('monthly-staff-schedule')
export class MonthlyStaffScheduleController {
  constructor(private readonly MonthlyStaffAvailabilityService: MonthlyStaffAvailabilityService) { }

  @Post()
  create(@Body() CreateMonthlyStaffAvailabilityDto: CreateMonthlyStaffAvailabilityDto) {
    return this.MonthlyStaffAvailabilityService.create(CreateMonthlyStaffAvailabilityDto);
  }

  @Get()
  findAll() {
    return this.MonthlyStaffAvailabilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.MonthlyStaffAvailabilityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateMonthlyStaffAvailabilityDto: UpdateMonthlyStaffAvailabilityDto) {
    return this.MonthlyStaffAvailabilityService.update(id, UpdateMonthlyStaffAvailabilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.MonthlyStaffAvailabilityService.remove(id);
  }
}
