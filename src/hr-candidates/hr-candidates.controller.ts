import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HrCandidatesService } from './hr-candidates.service';
import { CreateHrCandidateDto } from './dto/create-hr-candidate.dto';
import { UpdateHrCandidateDto } from './dto/update-hr-candidate.dto';

@Controller('hr-candidates')
export class HrCandidatesController {
  constructor(private readonly hrCandidatesService: HrCandidatesService) { }

  @Post()
  create(@Body() createHrCandidateDto: CreateHrCandidateDto) {
    return this.hrCandidatesService.create(createHrCandidateDto);
  }

  @Get()
  findAll() {
    return this.hrCandidatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hrCandidatesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHrCandidateDto: UpdateHrCandidateDto) {
    return this.hrCandidatesService.update(id, updateHrCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hrCandidatesService.remove(id);
  }
}
