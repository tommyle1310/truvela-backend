import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyStaffAvailabilityService } from './daily-staff-availability.service';
import { CreateDailyStaffAvailabilityDto } from './dto/create-daily-staff-availability.dto';
import { UpdateDailyStaffAvailabilityDto } from './dto/update-daily-staff-availability.dto';

@Controller('daily-staff-availability')
export class DailyStaffAvailabilityController {
  constructor(private readonly dailyStaffAvailabilityService: DailyStaffAvailabilityService) { }

  @Post()
  create(@Body() createDailyStaffAvailabilityDto: CreateDailyStaffAvailabilityDto) {
    return this.dailyStaffAvailabilityService.create(createDailyStaffAvailabilityDto);
  }

  @Get()
  findAll() {
    return this.dailyStaffAvailabilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyStaffAvailabilityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyStaffAvailabilityDto: UpdateDailyStaffAvailabilityDto) {
    return this.dailyStaffAvailabilityService.update(id, updateDailyStaffAvailabilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyStaffAvailabilityService.remove(id);
  }
}
