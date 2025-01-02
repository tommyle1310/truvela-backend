import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [FirebaseModule, UsersModule],
  controllers: [AppController],  // Do NOT include TestUsersController here
  providers: [AppService],
})
export class AppModule { }
