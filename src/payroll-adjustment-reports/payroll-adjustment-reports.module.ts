import { Module } from '@nestjs/common';
import { PayrollAdjustmentReportsService } from './payroll-adjustment-reports.service';
import { PayrollAdjustmentReportsController } from './payroll-adjustment-reports.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { OvertimeReportsService } from 'src/overtime-reports/overtime-reports.service';

@Module({
  imports: [FirebaseModule],
  controllers: [PayrollAdjustmentReportsController],
  providers: [PayrollAdjustmentReportsService, OvertimeReportsService],
})
export class PayrollAdjustmentReportsModule { }
