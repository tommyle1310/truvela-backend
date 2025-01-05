import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyAttendanceService } from './daily-attendance.service';
import { CreateDailyAttendanceDto } from './dto/create-daily-attendance.dto';
import { UpdateDailyAttendanceDto } from './dto/update-daily-attendance.dto';

@Controller('daily-attendance')
export class DailyAttendanceController {
  constructor(private readonly dailyAttendanceService: DailyAttendanceService) { }

  @Post()
  create(@Body() createDailyAttendanceDto: CreateDailyAttendanceDto) {
    return this.dailyAttendanceService.create(createDailyAttendanceDto);
  }

  @Get()
  findAll() {
    return this.dailyAttendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyAttendanceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyAttendanceDto: UpdateDailyAttendanceDto) {
    return this.dailyAttendanceService.update(id, updateDailyAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyAttendanceService.remove(id);
  }
}
