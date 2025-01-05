import { Module } from '@nestjs/common';
import { DailyAttendanceService } from './daily-attendance.service';
import { DailyAttendanceController } from './daily-attendance.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [DailyAttendanceController],
  providers: [DailyAttendanceService],
})
export class DailyAttendanceModule { }
