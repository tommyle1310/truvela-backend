import { Module } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [PayrollsController],
  providers: [PayrollsService],
})
export class PayrollsModule { }
