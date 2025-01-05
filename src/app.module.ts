import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { DepartmentsModule } from './departments/departments.module';
import { StaffsModule } from './staffs/staffs.module';
import { JobsModule } from './jobs/jobs.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SpasModule } from './spas/spas.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { StaffShiftsModule } from './staff-shifts/staff-shifts.module';

@Module({
  imports: [FirebaseModule, UsersModule, CustomersModule, DepartmentsModule, StaffsModule, JobsModule, PermissionsModule, SpasModule, ServiceCategoriesModule, StaffShiftsModule],
  controllers: [AppController],  // Do NOT include TestUsersController here
  providers: [AppService],
})
export class AppModule { }
