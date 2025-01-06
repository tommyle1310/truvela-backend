import { Module } from '@nestjs/common';
import { PayrollAdjustmentsService } from './payroll-adjustments.service';
import { PayrollAdjustmentsController } from './payroll-adjustments.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [PayrollAdjustmentsController],
  providers: [PayrollAdjustmentsService],
})
export class PayrollAdjustmentsModule { }
