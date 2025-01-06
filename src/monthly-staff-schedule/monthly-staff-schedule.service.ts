import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming Firebase service is available
import { CreateMonthlyStaffAvailabilityDto } from './dto/create-monthly-staff-schedule.dto';
import { UpdateMonthlyStaffAvailabilityDto } from './dto/update-monthly-staff-schedule.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/utils/functions'; // Assuming you have a function to format consistent responses

@Injectable()
export class MonthlyStaffAvailabilityService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createMonthlyStaffAvailabilityDto: CreateMonthlyStaffAvailabilityDto) {
    // Check if an entry for the given staff_id and month already exists
    const existingAvailability = await this.firebaseService.queryCollection(
      'monthlyStaffAvailability',
      'staff_id',
      createMonthlyStaffAvailabilityDto.staff_id
    );

    if (existingAvailability.length > 0) {
      createResponse('DuplicatedRecord', 'Staff availability record already exists for the given staff ID and month')
    }

    // Increment the counter for monthly staff availability ID if needed
    const availabilityIdCounter = await this.firebaseService.incrementCounter('monthlyStaffAvailabilityIdCounter');

    const availabilityData = {
      ...createMonthlyStaffAvailabilityDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const availabilityId = `MSTFS_${availabilityIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating monthly staff availability with data:', { id: availabilityId, ...availabilityData });

    try {
      // Create the monthly staff availability document in Firestore
      await this.firebaseService.createDocument('monthlyStaffAvailability', availabilityId, availabilityData);
    } catch (error) {
      console.error('Error creating monthly staff availability in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create monthly staff availability'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return createResponse('OK', { id: availabilityId, ...availabilityData }, 'Monthly staff availability successfully created');
  }

  async findAll() {
    // Fetch all monthly staff availability records from the 'monthlyStaffAvailability' collection
    const availabilityRecords = await this.firebaseService.getCollection('monthlyStaffAvailability');
    console.log('Fetched monthly staff availability records:', availabilityRecords);
    return createResponse('OK', availabilityRecords);
  }

  async findOne(id: string) {
    const availabilityDoc = await this.firebaseService.getDocument('monthlyStaffAvailability', id);

    if (!availabilityDoc) {
      return createResponse('NotFound', 'Monthly staff availability not found');
    }

    return createResponse('OK', availabilityDoc, 'Fetched monthly staff availability successfully');
  }

  async update(id: string, updateMonthlyStaffAvailabilityDto: UpdateMonthlyStaffAvailabilityDto) {
    // Check if the monthly staff availability exists
    const availability = await this.firebaseService.getDocument('monthlyStaffAvailability', id);

    if (!availability) {
      return createResponse('NotFound', 'Monthly staff availability not found');
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Prepare the update data, including the current timestamp
    const updateData = {
      ...JSON.parse(JSON.stringify(updateMonthlyStaffAvailabilityDto)),
      updated_at: currentTimestamp,
    };

    // Check if the month is already set in the record (to ensure we're checking only when month exists)
    if (availability.month) {
      // If the month exists, check if the staff_id is already associated with this month
      const existingAvailability = await this.firebaseService.queryCollection(
        'monthlyStaffAvailability',
        'staff_id',
        updateMonthlyStaffAvailabilityDto.staff_id
      );

      // If any existing availability record exists with the same staff_id and the same month, throw error
      if (
        existingAvailability.length > 0 &&
        existingAvailability[0].month === updateMonthlyStaffAvailabilityDto.month &&
        existingAvailability[0].staff_id === updateMonthlyStaffAvailabilityDto.staff_id
      ) {
        return createResponse('DuplicatedRecord', 'Staff availability record already exists for the given staff ID and month');
      }
    }

    try {
      // Update the monthly staff availability document in Firestore
      await this.firebaseService.updateDocument('monthlyStaffAvailability', id, updateData);
    } catch (error) {
      console.error('Error updating monthly staff availability:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update monthly staff availability'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Fetch the updated availability data
    const updatedAvailability = await this.firebaseService.getDocument('monthlyStaffAvailability', id);

    return createResponse('OK', updatedAvailability, 'Updated monthly staff availability successfully');
  }


  async remove(id: string) {
    const availability = await this.firebaseService.getDocument('monthlyStaffAvailability', id);

    if (!availability) {
      return createResponse('NotFound', 'Monthly staff availability not found');
    }

    await this.firebaseService.deleteDocument('monthlyStaffAvailability', id);

    return createResponse('OK', `Monthly staff availability with ID ${id} deleted successfully`);
  }
}
