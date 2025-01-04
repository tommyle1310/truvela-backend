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
  async findAll() {
    try {
      const departments = await this.firebaseService.getCollection('departments'); // Fetch departments
      console.log('Fetched departments:', departments);
      return createResponse('OK', departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch departments'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get a specific department by ID
  async findOne(id: string) {
    const department = await this.firebaseService.getDocument('departments', id); // Fetch department by ID

    if (!department) {
      return createResponse('NotFound', 'Department not found');
    }

    return createResponse('OK', department, 'Department retrieved successfully');
  }

  // Update an existing department
  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.firebaseService.getDocument('departments', id); // Fetch department by ID

    if (!department) {
      return createResponse('NotFound', 'Department not found');
    }

    // Convert the UpdateDepartmentDto to a plain object to avoid serialization issues
    const updateData = JSON.parse(JSON.stringify(updateDepartmentDto));

    // Update department in Firestore
    await this.firebaseService.updateDocument('departments', id, updateData);

    // Fetch the updated department data
    const updatedDepartment = await this.firebaseService.getDocument('departments', id);

    return createResponse('OK', updatedDepartment, 'Department updated successfully')
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
