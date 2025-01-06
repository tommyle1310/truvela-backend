import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming Firebase service is available
import { CreateWeeklyStaffAvailabilityDto } from './dto/create-weekly-staff-availability.dto';
import { UpdateWeeklyStaffAvailabilityDto } from './dto/update-weekly-staff-availability.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/utils/functions'; // Assuming you have a function to format consistent responses

@Injectable()
export class WeeklyStaffAvailabilityService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createWeeklyStaffAvailabilityDto: CreateWeeklyStaffAvailabilityDto) {
    // Check if an entry for the given staff_id and week_start_date already exists
    const existingAvailability = await this.firebaseService.queryCollection(
      'weeklyStaffAvailability',
      'staff_id',
      createWeeklyStaffAvailabilityDto.staff_id,
    );

    if (existingAvailability.length > 0) {
      createResponse('DuplicatedRecord', 'Staff availability record already exists for the given staff ID and week start date')
    }

    // Increment the counter for weekly staff availability ID if needed
    const availabilityIdCounter = await this.firebaseService.incrementCounter('weeklyStaffAvailabilityIdCounter');

    const availabilityData = {
      ...createWeeklyStaffAvailabilityDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const availabilityId = `WSTFA_${availabilityIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating weekly staff availability with data:', { id: availabilityId, ...availabilityData });

    try {
      // Create the weekly staff availability document in Firestore
      await this.firebaseService.createDocument('weeklyStaffAvailability', availabilityId, availabilityData);
    } catch (error) {
      console.error('Error creating weekly staff availability in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create weekly staff availability'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: availabilityId, ...availabilityData }, 'Weekly staff availability successfully created');
  }

  async findAll() {
    // Fetch all weekly staff availability records from the 'weeklyStaffAvailability' collection
    const availabilityRecords = await this.firebaseService.getCollection('weeklyStaffAvailability');

    // Log the fetched availability records
    console.log('Fetched weekly staff availability records:', availabilityRecords);

    // Return the fetched availability records
    return createResponse('OK', availabilityRecords);
  }

  async findOne(id: string) {
    // Fetch the weekly staff availability document from the 'weeklyStaffAvailability' collection
    const availabilityDoc = await this.firebaseService.getDocument('weeklyStaffAvailability', id);

    // Check if the availability record exists
    if (!availabilityDoc) {
      return createResponse('NotFound', 'Weekly staff availability not found');
    }

    return createResponse('OK', availabilityDoc, 'Fetched weekly staff availability successfully');
  }

  async update(id: string, updateWeeklyStaffAvailabilityDto: UpdateWeeklyStaffAvailabilityDto) {
    // Check if the weekly staff availability exists
    const availability = await this.firebaseService.getDocument('weeklyStaffAvailability', id);

    if (!availability) {
      return createResponse('NotFound', 'Weekly staff availability not found');
    }

    // Add the current timestamp for updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Convert the UpdateWeeklyStaffAvailabilityDto to a plain object and include updated_at
    const updateData = {
      ...JSON.parse(JSON.stringify(updateWeeklyStaffAvailabilityDto)),
      updated_at: currentTimestamp, // Add the updated_at timestamp
    };

    // Check if an entry for the given staff_id and week_start_date already exists
    const existingAvailability = await this.firebaseService.queryCollection(
      'weeklyStaffAvailability',
      'staff_id',
      updateWeeklyStaffAvailabilityDto.staff_id,
    );

    if (existingAvailability.length > 0) {
      createResponse('DuplicatedRecord', 'Staff availability record already exists for the given staff ID and week start date')
    }

    // Update the weekly staff availability document with the provided data
    try {
      await this.firebaseService.updateDocument('weeklyStaffAvailability', id, updateData);
    } catch (error) {
      console.error('Error updating weekly staff availability:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update weekly staff availability'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Fetch the updated availability data to return
    const updatedAvailability = await this.firebaseService.getDocument('weeklyStaffAvailability', id);

    return createResponse('OK', updatedAvailability, 'Updated weekly staff availability successfully');
  }

  async remove(id: string) {
    // Check if the weekly staff availability exists
    const availability = await this.firebaseService.getDocument('weeklyStaffAvailability', id);

    if (!availability) {
      return createResponse('NotFound', 'Weekly staff availability not found');
    }

    // Delete the weekly staff availability document
    await this.firebaseService.deleteDocument('weeklyStaffAvailability', id);

    return createResponse('OK', `Weekly staff availability with ID ${id} deleted successfully`);
  }
}
