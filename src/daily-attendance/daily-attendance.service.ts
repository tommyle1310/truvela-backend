import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming you have this Firebase service
import { CreateDailyAttendanceDto } from './dto/create-daily-attendance.dto';
import { UpdateDailyAttendanceDto } from './dto/update-daily-attendance.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/utils/functions'; // Assuming you have this helper for consistent responses

@Injectable()
export class DailyAttendanceService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createDailyAttendanceDto: CreateDailyAttendanceDto) {
    console.log('Checking if the attendance record already exists for the given staff_id and date...');

    // Query Firestore for existing attendance records
    const existingAttendance = await this.firebaseService.queryCollection(
      'dailyAttendance',
      'staff_id',
      createDailyAttendanceDto.staff_id,
    );

    // Check if the attendance record already exists for the same date
    const sameDateAttendance = existingAttendance.find(
      (record) => record.date === createDailyAttendanceDto.date,
    );

    if (sameDateAttendance) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Attendance record already exists for this date'),
        HttpStatus.CONFLICT,
      );
    }

    // Generate attendance ID using Firestore counter
    const attendanceIdCounter = await this.firebaseService.incrementCounter('dailyAttendanceIdCounter');

    // Prepare the attendance data
    const attendanceData = {
      ...createDailyAttendanceDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    // Generate the attendance ID
    const attendanceId = `DAY_ATT_${attendanceIdCounter}`;

    // Log the data before creating the document in Firestore
    console.log('Creating daily attendance record with data:', { id: attendanceId, ...attendanceData });

    try {
      // Create the daily attendance document in Firestore
      await this.firebaseService.createDocument('dailyAttendance', attendanceId, attendanceData);
    } catch (error) {
      console.error('Error creating daily attendance record in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create daily attendance record'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: attendanceId, ...attendanceData }, 'Daily attendance record created successfully');
  }



  async update(id: string, updateDailyAttendanceDto: UpdateDailyAttendanceDto) {
    // Check if the daily attendance record exists
    const attendanceRecord = await this.firebaseService.getDocument('dailyAttendance', id);

    if (!attendanceRecord) {
      return createResponse('NotFound', 'Daily attendance record not found');
    }

    // Add the current timestamp for updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Prepare the data for update (adding updated_at field)
    const updateData = {
      ...updateDailyAttendanceDto,
      updated_at: currentTimestamp,
    };

    try {
      // Update the existing document using the same ID
      await this.firebaseService.updateDocument('dailyAttendance', id, updateData);
    } catch (error) {
      console.error('Error updating daily attendance record:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update daily attendance record'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Fetch the updated daily attendance record and return
    const updatedAttendanceRecord = await this.firebaseService.getDocument('dailyAttendance', id);
    return createResponse('OK', updatedAttendanceRecord, 'Updated daily attendance successfully');
  }


  async findOne(id: string) {
    // Fetch the daily attendance record by ID
    const attendanceDoc = await this.firebaseService.getDocument('dailyAttendance', id);
    if (!attendanceDoc) {
      return createResponse('NotFound', 'Daily attendance record not found');
    }
    return createResponse('OK', attendanceDoc, 'Fetched daily attendance successfully');
  }

  async findAll() {
    // Fetch all daily attendance records
    const attendanceRecords = await this.firebaseService.getCollection('dailyAttendance');
    return createResponse('OK', attendanceRecords);
  }

  async remove(id: string) {
    // Check if the daily attedance exists
    const dailyAttendance = await this.firebaseService.getDocument('dailyAttendance', id);

    if (!dailyAttendance) {
      return createResponse('NotFound');
    }

    // Delete the daily attedance document
    await this.firebaseService.deleteDocument('dailyAttendance', id);

    return createResponse('OK', `Daily Attendance with ID ${id} deleted successfully`);
  }
}