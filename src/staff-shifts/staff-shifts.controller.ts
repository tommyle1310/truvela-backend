import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffShiftService } from './staff-shifts.service';
import { CreateStaffShiftDto } from './dto/create-staff-shift.dto';
import { UpdateStaffShiftDto } from './dto/update-staff-shift.dto';

@Controller('staff-shifts')
export class StaffShiftsController {
  constructor(private readonly staffShiftsService: StaffShiftService) { }

  @Post()
  create(@Body() createStaffShiftDto: CreateStaffShiftDto) {
    return this.staffShiftsService.create(createStaffShiftDto);
  }

  @Get()
  findAll() {
    return this.staffShiftsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffShiftsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffShiftDto: UpdateStaffShiftDto) {
    return this.staffShiftsService.update(id, updateStaffShiftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffShiftsService.remove(id);
  }
}
