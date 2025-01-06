import { Module } from '@nestjs/common';
import { SalaryDefinitionsService } from './salary-definitions.service';
import { SalaryDefinitionsController } from './salary-definitions.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [SalaryDefinitionsController],
  providers: [SalaryDefinitionsService],
})
export class SalaryDefinitionsModule { }
