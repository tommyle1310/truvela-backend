import { Module } from '@nestjs/common';
import { StaffShiftService } from './staff-shifts.service';
import { StaffShiftsController } from './staff-shifts.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [StaffShiftsController],
  providers: [StaffShiftService],
})
export class StaffShiftsModule { }
