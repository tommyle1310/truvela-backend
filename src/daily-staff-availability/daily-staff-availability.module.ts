import { Module } from '@nestjs/common';
import { DailyStaffAvailabilityService } from './daily-staff-availability.service';
import { DailyStaffAvailabilityController } from './daily-staff-availability.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [DailyStaffAvailabilityController],
  providers: [DailyStaffAvailabilityService],
})
export class DailyStaffAvailabilityModule { }
