import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSalaryDefinitionDto } from './dto/create-salary-definition.dto';
import { UpdateSalaryDefinitionDto } from './dto/update-salary-definition.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming Firebase service is available
import { createResponse } from 'src/utils/functions'; // Utility for structured responses

@Injectable()
export class SalaryDefinitionsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  // Create a new salary definition
  async create(createSalaryDefinitionDto: CreateSalaryDefinitionDto) {
    // Check if the job title and job level already exist in the database
    const existingSalaryDef = await this.firebaseService.queryCollection(
      'salaryDefinition',
      'job_title',
      createSalaryDefinitionDto.job_title
    );

    // Find if there is a record with the same job level and job title
    const existingRecord = existingSalaryDef.find(
      (record) => record.job_level === createSalaryDefinitionDto.job_level
    );

    if (existingRecord) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Salary definition with this job title and level already exists'),
        HttpStatus.CONFLICT,
      );
    }

    // Increment the counter for salary definition ID if needed
    const salaryDefIdCounter = await this.firebaseService.incrementCounter('salaryDefinitionIdCounter');

    const salaryDefData = {
      ...createSalaryDefinitionDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const salaryDefId = `SD_${salaryDefIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating salary definition with data:', { id: salaryDefId, ...salaryDefData });

    try {
      // Create the salary definition document in Firestore
      await this.firebaseService.createDocument('salaryDefinition', salaryDefId, salaryDefData);
    } catch (error) {
      console.error('Error creating salary definition in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create salary definition'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: salaryDefId, ...salaryDefData }, 'Salary definition successfully created');
  }


  // Get all salary definitions
  async findAll() {
    try {
      const salaryDefinitions = await this.firebaseService.getCollection('salaryDefinition'); // Fetch all salary definitions
      console.log('Fetched salary definitions:', salaryDefinitions);
      return createResponse('OK', salaryDefinitions);
    } catch (error) {
      console.error('Error fetching salary definitions:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch salary definitions'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get a specific salary definition by ID
  async findOne(id: string) {
    const salaryDef = await this.firebaseService.getDocument('salaryDefinition', id); // Fetch salary definition by ID

    if (!salaryDef) {
      return createResponse('NotFound', 'Salary definition not found');
    }

    return createResponse('OK', salaryDef, 'Salary definition retrieved successfully');
  }

  // Update an existing salary definition
  async update(id: string, updateSalaryDefinitionDto: UpdateSalaryDefinitionDto) {
    const salaryDef = await this.firebaseService.getDocument('salaryDefinition', id); // Fetch salary definition by ID

    if (!salaryDef) {
      return createResponse('NotFound', 'Salary definition not found');
    }

    // Check if the job title and job level already exist in the database (excluding the current record)
    const existingSalaryDef = await this.firebaseService.queryCollection(
      'salaryDefinition',
      'job_title',
      updateSalaryDefinitionDto.job_title
    );

    const existingRecord = existingSalaryDef.find(
      (record) =>
        record.job_level === updateSalaryDefinitionDto.job_level && record.id !== id
    );

    if (existingRecord) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Salary definition with this job title and level already exists'),
        HttpStatus.CONFLICT,
      );
    }

    // Add the current timestamp for updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Convert the UpdateSalaryDefinitionDto to a plain object and include updated_at
    const updateData = {
      ...JSON.parse(JSON.stringify(updateSalaryDefinitionDto)),
      updated_at: currentTimestamp,
    };

    // Update the salary definition document with the provided data
    try {
      await this.firebaseService.updateDocument('salaryDefinition', id, updateData);
    } catch (error) {
      console.error('Error updating salary definition:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update salary definition'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Fetch the updated salary definition data to return
    const updatedSalaryDef = await this.firebaseService.getDocument('salaryDefinition', id);

    return createResponse('OK', updatedSalaryDef, 'Updated salary definition successfully');
  }


  // Remove a salary definition by ID
  async remove(id: string) {
    const salaryDef = await this.firebaseService.getDocument('salaryDefinition', id); // Fetch salary definition by ID

    if (!salaryDef) {
      return createResponse('NotFound', 'Salary definition not found');
    }

    // Delete salary definition from Firestore
    await this.firebaseService.deleteDocument('salaryDefinition', id);

    return createResponse('OK', `Salary definition with ID ${id} deleted successfully`);
  }
}
