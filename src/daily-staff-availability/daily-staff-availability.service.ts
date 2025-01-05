import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming Firebase service is available
import { CreateDailyStaffAvailabilityDto } from './dto/create-daily-staff-availability.dto';
import { UpdateDailyStaffAvailabilityDto } from './dto/update-daily-staff-availability.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/utils/functions'; // Assuming you have a function to format consistent responses

@Injectable()
export class DailyStaffAvailabilityService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createDailyStaffAvailabilityDto: CreateDailyStaffAvailabilityDto) {
    // Check if an entry for the given staff_id and date already exists
    const existingAvailability = await this.firebaseService.queryCollection('dailyStaffAvailability', 'staff_id', createDailyStaffAvailabilityDto.staff_id);

    if (existingAvailability.length > 0) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Staff availability record already exists for the given staff ID and date'),
        HttpStatus.CONFLICT,
      );
    }

    // Increment the counter for daily staff availability ID if needed
    const availabilityIdCounter = await this.firebaseService.incrementCounter('dailyStaffAvailabilityIdCounter');

    const availabilityData = {
      ...createDailyStaffAvailabilityDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const availabilityId = `DSTFA_${availabilityIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating daily staff availability with data:', { id: availabilityId, ...availabilityData });

    try {
      // Create the daily staff availability document in Firestore
      await this.firebaseService.createDocument('dailyStaffAvailability', availabilityId, availabilityData);
    } catch (error) {
      console.error('Error creating daily staff availability in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create daily staff availability'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: availabilityId, ...availabilityData }, 'Daily staff availability successfully created');
  }

  async findAll() {
    // Fetch all daily staff availability records from the 'dailyStaffAvailability' collection
    const availabilityRecords = await this.firebaseService.getCollection('dailyStaffAvailability');

    // Log the fetched availability records
    console.log('Fetched daily staff availability records:', availabilityRecords);

    // Return the fetched availability records
    return createResponse('OK', availabilityRecords);
  }

  async findOne(id: string) {
    // Fetch the daily staff availability document from the 'dailyStaffAvailability' collection
    const availabilityDoc = await this.firebaseService.getDocument('dailyStaffAvailability', id);

    // Check if the availability record exists
    if (!availabilityDoc) {
      return createResponse('NotFound', 'Daily staff availability not found');
    }

    return createResponse('OK', availabilityDoc, 'Fetched daily staff availability successfully');
  }

  async update(id: string, updateDailyStaffAvailabilityDto: UpdateDailyStaffAvailabilityDto) {
    // Check if the daily staff availability exists
    const availability = await this.firebaseService.getDocument('dailyStaffAvailability', id);

    if (!availability) {
      return createResponse('NotFound', 'Daily staff availability not found');
    }

    // Add the current timestamp for updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Convert the UpdateDailyStaffAvailabilityDto to a plain object and include updated_at
    const updateData = {
      ...JSON.parse(JSON.stringify(updateDailyStaffAvailabilityDto)),
      updated_at: currentTimestamp, // Add the updated_at timestamp
    };

    // Update the daily staff availability document with the provided data
    try {
      await this.firebaseService.updateDocument('dailyStaffAvailability', id, updateData);
    } catch (error) {
      console.error('Error updating daily staff availability:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update daily staff availability'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Fetch the updated availability data to return
    const updatedAvailability = await this.firebaseService.getDocument('dailyStaffAvailability', id);

    return createResponse('OK', updatedAvailability, 'Updated daily staff availability successfully');
  }

  async remove(id: string) {
    // Check if the daily staff availability exists
    const availability = await this.firebaseService.getDocument('dailyStaffAvailability', id);

    if (!availability) {
      return createResponse('NotFound', 'Daily staff availability not found');
    }

    // Delete the daily staff availability document
    await this.firebaseService.deleteDocument('dailyStaffAvailability', id);

    return createResponse('OK', `Daily staff availability with ID ${id} deleted successfully`);
  }
}
