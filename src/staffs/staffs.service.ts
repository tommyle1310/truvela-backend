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
    console.log('Checking for existing staff...');

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
      created_at: Math.floor(Date.now() / 1000), // Set creation timestamp
    };

    // Log the data before performing the Firestore operation
    console.log('Creating staff with data:', { id: staffId, ...staffData });

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

        // Merge the job and department details into the staff data
        return {
          ...staff,
          job: jobDetails ? jobDetails : null,
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

    if (!staff) {
      return createResponse('NotFound', 'Staff not found');
    }

    return createResponse('OK', staff, 'Staff retrieved successfully');
  }

  // Update an existing staff
  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.firebaseService.getDocument('staffs', id); // Fetch staff by ID

    if (!staff) {
      return createResponse('NotFound', 'Staff not found');
    }

    // Convert the UpdateStaffDto to a plain object to avoid serialization issues
    const updateData = JSON.parse(JSON.stringify(updateStaffDto));

    // Update staff in Firestore
    await this.firebaseService.updateDocument('staffs', id, updateData);

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
