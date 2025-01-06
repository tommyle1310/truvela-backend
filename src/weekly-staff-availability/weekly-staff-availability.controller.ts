import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeeklyStaffAvailabilityService } from './weekly-staff-availability.service';
import { CreateWeeklyStaffAvailabilityDto } from './dto/create-weekly-staff-availability.dto';
import { UpdateWeeklyStaffAvailabilityDto } from './dto/update-weekly-staff-availability.dto';

@Controller('weekly-staff-availability')
export class WeeklyStaffAvailabilityController {
  constructor(private readonly weeklyStaffAvailabilityService: WeeklyStaffAvailabilityService) { }

  @Post()
  create(@Body() createWeeklyStaffAvailabilityDto: CreateWeeklyStaffAvailabilityDto) {
    return this.weeklyStaffAvailabilityService.create(createWeeklyStaffAvailabilityDto);
  }

  @Get()
  findAll() {
    return this.weeklyStaffAvailabilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weeklyStaffAvailabilityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeeklyStaffAvailabilityDto: UpdateWeeklyStaffAvailabilityDto) {
    return this.weeklyStaffAvailabilityService.update(id, updateWeeklyStaffAvailabilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weeklyStaffAvailabilityService.remove(id);
  }
}
