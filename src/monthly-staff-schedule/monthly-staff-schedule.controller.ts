import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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

  @Get() // Default route
  findAll() {
    return this.MonthlyStaffAvailabilityService.findAll();
  }

  // Custom route for handling month query
  @Get('group-by-staff') // This handles the '/monthly-staff-schedule/abc/month' route
  async findAllGroupByStaff(@Query('month') month: string) {
    if (!month) {
      return { message: 'Month query parameter is required' };
    }
    return this.MonthlyStaffAvailabilityService.findAllGroupByStaff(month);
  }

  @Get('group-by-date') // This handles the '/monthly-staff-schedule/abc/month' route
  async findAllGroupByDate(@Query('month') month: string) {
    if (!month) {
      return { message: 'Month query parameter is required' };
    }
    return this.MonthlyStaffAvailabilityService.findAllGroupByDate(month);
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
