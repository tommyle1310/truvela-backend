import { Module } from '@nestjs/common';
import { SpasService } from './spas.service';
import { SpasController } from './spas.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [SpasController],
  providers: [SpasService],
})
export class SpasModule { }
