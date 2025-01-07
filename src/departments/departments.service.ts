import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming you are using FirebaseService
import { createResponse } from 'src/utils/functions'; // Utility for structured responses

@Injectable()
export class DepartmentsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  // Create a new department
  async create(createDepartmentDto: CreateDepartmentDto) {
    console.log('Checking for existing department...');

    // Check if the department name already exists in Firebase
    const existingDepartment = await this.firebaseService.queryCollection('departments', 'name', createDepartmentDto.name);

    if (existingDepartment.length > 0) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Department name is already taken'),
        HttpStatus.CONFLICT,
      );
    }

    // Increment department ID counter
    const departmentIdCounter = await this.firebaseService.incrementCounter('departmentIdCounter');
    const departmentId = `DEP_${departmentIdCounter}`; // Generate a unique department ID

    const departmentData = {
      ...createDepartmentDto,
      created_at: Math.floor(Date.now() / 1000), // Set creation timestamp
    };

    // Log the data before performing the Firestore operation
    console.log('Creating department with data:', { id: departmentId, ...departmentData });

    try {
      await this.firebaseService.createDocument('departments', departmentId, departmentData); // Store department in Firestore
    } catch (error) {
      console.error('Error creating department in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create department'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: departmentId, ...departmentData }, 'Department successfully created');
  }

  // Get all departments
  async findAll(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;

      // Fetch the staff count to calculate total pages
      const departmentCount = await this.firebaseService.getCollectionCount('staffs', 'department');

      // Calculate total pages
      const totalPages = Math.ceil(departmentCount / limit);
      // Fetch all departments
      const departments = await this.firebaseService.getCollection('departments');

      // Map through the departments and fetch the staff count and a limited list of staff (max 5)
      const departmentsWithStaffInfo = await Promise.all(departments.map(async (department) => {
        // Fetch a limited number (max 5) of staff in this department
        let staff_list = await this.firebaseService.queryCollection('staffs', 'department', department.id);

        return {
          ...department,
          current_page: page,
          total_pages: totalPages,
          total_items: departmentCount,
          items_per_page: limit,
          total_staffs: staff_list.length, // Add total staff count to the department data
          staff_list // List of up to 5 staff members in this department
        };
      }));

      return createResponse('OK', departmentsWithStaffInfo);
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch departments'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  // The findOne method fetches a specific department by ID and also returns the total number of staff in that department
  async findOne(id: string, page: number = 1, limit: number = 10) {
    // Fetch the department by ID
    const department = await this.firebaseService.getDocument('departments', id);

    if (!department) {
      return createResponse('NotFound', 'Department not found');
    }

    // Calculate offset (skip number of items based on the current page)
    const offset = (page - 1) * limit;

    // Fetch the staff count to calculate total pages
    const staffCount = await this.firebaseService.getCollectionCount('staffs', 'department', id);

    // Calculate total pages
    const totalPages = Math.ceil(staffCount / limit);

    // Fetch the list of staff members with pagination
    const list_staffs = await this.firebaseService.queryCollection(
      'staffs',
      'department',
      id,
      limit
    );

    // For each staff, fetch the work_office details (if available)
    const list_staffsWithWorkOffice = await Promise.all(list_staffs.map(async (staff) => {
      const work_officeDetails = await this.firebaseService.getDocument('spas', staff.work_office);

      return {
        ...staff,  // Keep the existing staff data
        work_office: work_officeDetails  // Add the fetched work_office details
      };
    }));

    return createResponse('OK', {
      ...department,
      list_staffs: list_staffsWithWorkOffice,
      current_page: page,
      total_pages: totalPages,
      items_per_page: limit,
      total_staffs: list_staffs.length, // Add total staff count to the department data
    }, 'Department retrieved successfully');
  }



  // Update an existing department
  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.firebaseService.getDocument('departments', id); // Fetch department by ID

    if (!department) {
      return createResponse('NotFound', 'Department not found');
    }

    // Add the current timestamp for the updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Convert the UpdateDepartmentDto to a plain object and include updated_at
    const updateData = {
      ...JSON.parse(JSON.stringify(updateDepartmentDto)),
      updated_at: currentTimestamp, // Add the updated_at timestamp
    };

    // Check if there's a new 'id' in the request body (i.e., if the ID needs to be changed)
    if (updateDepartmentDto.id && updateDepartmentDto.id !== id) {
      const newId = updateDepartmentDto.id;

      try {
        // Create a new document with the new ID
        await this.firebaseService.createDocument('departments', newId, {
          ...updateData,
          created_at: department.created_at,  // Retain the original 'created_at'
        });

        // After creating the document with the new ID, delete the old one
        await this.firebaseService.deleteDocument('departments', id);

        // Return the response with the updated data, now under the new ID
        return createResponse('OK', { id: newId, ...updateData }, 'Department updated successfully with new ID');
      } catch (error) {
        console.error('Error updating department ID in Firestore:', error);
        throw new HttpException(
          createResponse('ServerError', 'Failed to update department with new ID'),
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    // If no new ID is provided, update the current document normally
    try {
      await this.firebaseService.updateDocument('departments', id, updateData);
    } catch (error) {
      console.error('Error updating department:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update department'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Fetch the updated department data
    const updatedDepartment = await this.firebaseService.getDocument('departments', id);

    return createResponse('OK', updatedDepartment, 'Department updated successfully');
  }


  // Remove a department by ID
  async remove(id: string) {
    const department = await this.firebaseService.getDocument('departments', id); // Fetch department by ID

    if (!department) {
      return createResponse('NotFound', 'Department not found');
    }

    // Delete department from Firestore
    await this.firebaseService.deleteDocument('departments', id);

    return createResponse('OK', `Department with ID ${id} deleted successfully`)
  }
}
