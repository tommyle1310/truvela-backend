import { Injectable } from '@nestjs/common';
import { CreateStaffShiftDto } from './dto/create-staff-shift.dto';
import { UpdateStaffShiftDto } from './dto/update-staff-shift.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming this service exists
import { createResponse } from 'src/utils/functions'; // Assuming this utility function exists
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class StaffShiftService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createStaffShiftDto: CreateStaffShiftDto) {
    // Check if shift with the same type already exists for the time period
    const existingShift = await this.firebaseService.queryCollection(
      'staffShifts',
      'id',
      createStaffShiftDto.id
    );

    if (existingShift.length > 0) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Shift id already exists for this period'),
        HttpStatus.CONFLICT
      );
    }

    // Increment the counter for staff shift ID if needed
    const staffShiftIdCounter = await this.firebaseService.incrementCounter('staffShiftIdCounter');

    const staffShiftData = {
      ...createStaffShiftDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const staffShiftId = `SHIFT_${staffShiftIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating staff shift with data:', { id: staffShiftId, ...staffShiftData });

    try {
      // Create the staff shift document in Firestore
      await this.firebaseService.createDocument('staffShifts', staffShiftId, staffShiftData);
    } catch (error) {
      console.error('Error creating staff shift in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create staff shift'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return createResponse('OK', { id: staffShiftId, ...staffShiftData }, 'Staff shift successfully created');
  }

  async findAll() {
    // Fetch all staff shifts from the 'staffShifts' collection
    const staffShifts = await this.firebaseService.getCollection('staffShifts');

    // Log the fetched staff shifts
    console.log('Fetched staff shifts:', staffShifts);

    // Return the fetched staff shifts
    return createResponse('OK', staffShifts);
  }

  async findOne(id: string) {
    // Fetch the staff shift document from the 'staffShifts' collection
    const staffShiftDoc = await this.firebaseService.getDocument('staffShifts', id);
    console.log("check?", staffShiftDoc, 'id?', id);

    // Check if the staff shift exists
    if (!staffShiftDoc) {
      return createResponse('NotFound', 'Staff shift not found');
    }

    // If you want to allow updating the document's ID (or other fields) here:
    // Example: If you want to update certain fields or change the document's ID
    const updateData = {
      ...staffShiftDoc,
      updated_at: Math.floor(Date.now() / 1000), // Adding updated_at timestamp if needed
    };

    try {
      // Update the staff shift document in the Firestore collection
      // If the document ID is the same, no need to change it, else we would update it here
      await this.firebaseService.updateDocument('staffShifts', id, updateData);

      // Fetch the updated staff shift data to return (to reflect changes)
      const updatedStaffShift = await this.firebaseService.getDocument('staffShifts', id);

      return createResponse('OK', updatedStaffShift, 'Updated staff shift successfully');
    } catch (error) {
      console.error('Error updating staff shift in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update staff shift'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updateStaffShiftDto: UpdateStaffShiftDto) {
    // Check if the staff shift exists
    const staffShift = await this.firebaseService.getDocument('staffShifts', id);

    if (!staffShift) {
      return createResponse('NotFound', 'Staff shift not found');
    }

    // Add the current timestamp for the updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Convert the UpdateStaffShiftDto to a plain object and include updated_at
    const updateData = {
      ...JSON.parse(JSON.stringify(updateStaffShiftDto)),
      updated_at: currentTimestamp, // Add the updated_at timestamp
    };

    // Check if there's a new 'id' in the request body (i.e., if the ID needs to be changed)
    if (updateStaffShiftDto.id && updateStaffShiftDto.id !== id) {
      const newId = updateStaffShiftDto.id;

      try {
        // Create a new document with the new ID
        await this.firebaseService.createDocument('staffShifts', newId, {
          ...updateData,
          created_at: staffShift.created_at,  // Retain the original 'created_at'
        });

        // After creating the document with the new ID, delete the old one
        await this.firebaseService.deleteDocument('staffShifts', id);

        // Return the response with the updated data, now under the new ID
        return createResponse('OK', { id: newId, ...updateData }, 'Staff shift updated successfully with new ID');
      } catch (error) {
        console.error('Error updating staff shift ID in Firestore:', error);
        throw new HttpException(
          createResponse('ServerError', 'Failed to update staff shift with new ID'),
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    // If no new ID is provided, update the current document normally
    try {
      await this.firebaseService.updateDocument('staffShifts', id, updateData);
    } catch (error) {
      console.error('Error updating staff shift:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update staff shift'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Fetch the updated staff shift data to return
    const updatedStaffShift = await this.firebaseService.getDocument('staffShifts', id);

    return createResponse('OK', updatedStaffShift, 'Updated staff shift successfully');
  }


  async remove(id: string) {
    // Check if the staff shift exists
    const staffShift = await this.firebaseService.getDocument('staffShifts', id);

    if (!staffShift) {
      return createResponse('NotFound', 'Staff shift not found');
    }

    // Delete the staff shift document
    await this.firebaseService.deleteDocument('staffShifts', id);

    return createResponse('OK', `Staff shift with ID ${id} deleted successfully`);
  }
}
