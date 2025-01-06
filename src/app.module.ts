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
import { DailyAttendanceModule } from './daily-attendance/daily-attendance.module';
import { HrCandidatesModule } from './hr-candidates/hr-candidates.module';
import { DailyStaffAvailabilityModule } from './daily-staff-availability/daily-staff-availability.module';
import { WeeklyStaffAvailabilityModule } from './weekly-staff-availability/weekly-staff-availability.module';
import { MonthlyStaffScheduleModule } from './monthly-staff-schedule/monthly-staff-schedule.module';

@Module({
  imports: [FirebaseModule, UsersModule, CustomersModule, DepartmentsModule, StaffsModule, JobsModule, PermissionsModule, SpasModule, ServiceCategoriesModule, StaffShiftsModule, DailyAttendanceModule, HrCandidatesModule, DailyStaffAvailabilityModule, WeeklyStaffAvailabilityModule, MonthlyStaffScheduleModule],
  controllers: [AppController],  // Do NOT include TestUsersController here
  providers: [AppService],
})
export class AppModule { }
