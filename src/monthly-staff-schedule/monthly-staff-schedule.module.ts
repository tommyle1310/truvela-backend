import { Module } from '@nestjs/common';
import { MonthlyStaffAvailabilityService } from './monthly-staff-schedule.service';
import { MonthlyStaffScheduleController } from './monthly-staff-schedule.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [MonthlyStaffScheduleController],
  providers: [MonthlyStaffAvailabilityService],
})
export class MonthlyStaffScheduleModule { }
