import { Module } from '@nestjs/common';
import { OvertimeReportsService } from './overtime-reports.service';
import { OvertimeReportsController } from './overtime-reports.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [OvertimeReportsController],
  providers: [OvertimeReportsService],
})
export class OvertimeReportsModule { }
