import { Module } from '@nestjs/common';
import { WeeklyStaffAvailabilityService } from './weekly-staff-availability.service';
import { WeeklyStaffAvailabilityController } from './weekly-staff-availability.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [WeeklyStaffAvailabilityController],
  providers: [WeeklyStaffAvailabilityService],
})
export class WeeklyStaffAvailabilityModule { }
