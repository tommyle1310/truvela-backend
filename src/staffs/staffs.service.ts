import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming you're using FirebaseService
import { createResponse } from 'src/utils/functions'; // Utility for structured responses

@Injectable()
export class StaffsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  // Create a new staff
  async create(createStaffDto: CreateStaffDto) {

    // Check if the staff email already exists in Firebase
    const existingStaff = await this.firebaseService.queryCollection('staffs', 'email', createStaffDto.email);

    if (existingStaff.length > 0) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Staff with this email already exists'),
        HttpStatus.CONFLICT,
      );
    }

    // Increment staff ID counter
    const staffIdCounter = await this.firebaseService.incrementCounter('staffIdCounter');
    const staffId = `STF_${staffIdCounter}`; // Generate a unique staff ID

    const staffData = {
      ...createStaffDto,
      id: staffId,
      created_at: Math.floor(Date.now() / 1000), // Set creation timestamp
    };


    try {
      await this.firebaseService.createDocument('staffs', staffId, staffData); // Store staff in Firestore
    } catch (error) {
      console.error('Error creating staff in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create staff'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: staffId, ...staffData }, 'Staff successfully created');
  }

  // Get all staffs
  async findAll(page: number = 1, limit: number = 10) {
    try {
      // Calculate offset (skip number of items based on the current page)
      const offset = (page - 1) * limit;

      // Fetch the staff count to calculate total pages
      const staffCount = await this.firebaseService.getCollectionCount('staffs');

      // Calculate total pages
      const totalPages = Math.ceil(staffCount / limit);

      // Fetch the list of staff members with pagination
      const staffs = await this.firebaseService.getCollectionWithPagination(
        'staffs',
        'first_name',
        'desc',
        limit,
        offset
      );

      // Prepare to fetch job and department details for each staff
      const staffsWithDetails = await Promise.all(staffs.map(async (staff) => {
        // Fetch job details using staff's job ID
        const jobDetails = await this.firebaseService.getDocument('jobs', staff.job);

        // Fetch department details using staff's department ID
        const departmentDetails = await this.firebaseService.getDocument('departments', staff.department);
        const work_officeDetails = await this.firebaseService.getDocument('spas', staff.work_office);

        // Merge the job and department details into the staff data
        return {
          ...staff,
          job: jobDetails ? jobDetails : null,
          work_office: work_officeDetails ? work_officeDetails : null,
          department: departmentDetails ? departmentDetails : null,
        };
      }));

      // Return the response with metadata and staff data
      return createResponse('OK', {
        staffs: staffsWithDetails,
        current_page: page,
        total_pages: totalPages,
        total_items: staffCount,
        items_per_page: limit,
      });

    } catch (error) {
      console.error('Error fetching staffs:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch staffs'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }





  // Get a specific staff by ID
  async findOne(id: string) {
    const staff = await this.firebaseService.getDocument('staffs', id); // Fetch staff by ID
    const jobDetails = await this.firebaseService.getDocument('jobs', staff.job);

    // Fetch department details using staff's department ID
    const departmentDetails = await this.firebaseService.getDocument('departments', staff.department);
    const work_officeDetails = await this.firebaseService.getDocument('spas', staff.work_office);
    if (!staff) {
      return createResponse('NotFound', 'Staff not found');
    }

    return createResponse('OK', { ...staff, work_office: work_officeDetails, department: departmentDetails, job: jobDetails }, 'Staff retrieved successfully');
  }

  // Update an existing staff
  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.firebaseService.getDocument('staffs', id); // Fetch staff by ID

    if (!staff) {
      return createResponse('NotFound', 'Staff not found');
    }

    // Add the current timestamp for the updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Convert the UpdateStaffDto to a plain object and include updated_at
    const updateData = {
      ...JSON.parse(JSON.stringify(updateStaffDto)),
      updated_at: currentTimestamp, // Add the updated_at timestamp
    };

    // Check if there's a new 'id' in the request body (i.e., if the ID needs to be changed)
    if (updateStaffDto.id && updateStaffDto.id !== id) {
      const newId = updateStaffDto.id;

      try {
        // Create a new document with the new ID
        await this.firebaseService.createDocument('staffs', newId, {
          ...updateData,
          created_at: staff.created_at,  // Retain the original 'created_at'
        });

        // After creating the document with the new ID, delete the old one
        await this.firebaseService.deleteDocument('staffs', id);

        // Return the response with the updated data, now under the new ID
        return createResponse('OK', { id: newId, ...updateData }, 'Staff updated successfully with new ID');
      } catch (error) {
        console.error('Error updating staff ID in Firestore:', error);
        throw new HttpException(
          createResponse('ServerError', 'Failed to update staff with new ID'),
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    // If no new ID is provided, update the current document normally
    try {
      await this.firebaseService.updateDocument('staffs', id, updateData);
    } catch (error) {
      console.error('Error updating staff:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update staff'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Fetch the updated staff data
    const updatedStaff = await this.firebaseService.getDocument('staffs', id);

    return createResponse('OK', updatedStaff, 'Staff updated successfully');
  }


  // Remove a staff by ID
  async remove(id: string) {
    const staff = await this.firebaseService.getDocument('staffs', id); // Fetch staff by ID

    if (!staff) {
      return createResponse('NotFound', 'Staff not found');
    }

    // Delete staff from Firestore
    await this.firebaseService.deleteDocument('staffs', id);

    return createResponse('OK', `Staff with ID ${id} deleted successfully`);
  }
}
