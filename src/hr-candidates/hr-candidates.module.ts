import { Module } from '@nestjs/common';
import { HrCandidatesService } from './hr-candidates.service';
import { HrCandidatesController } from './hr-candidates.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [HrCandidatesController],
  providers: [HrCandidatesService],
})
export class HrCandidatesModule { }
