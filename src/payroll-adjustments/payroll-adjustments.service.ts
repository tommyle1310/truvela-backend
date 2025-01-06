import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service'; // Firebase service for database operations
import { CreatePayrollAdjustmentDto } from './dto/create-payroll-adjustment.dto';
import { UpdatePayrollAdjustmentDto } from './dto/update-payroll-adjustment.dto';
import { createResponse } from 'src/utils/functions'; // Utility function for structured responses
import { Enum_PayrollAdjustmentType } from 'src/utils/enums'; // Enum for adjustment types

@Injectable()
export class PayrollAdjustmentsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  // Create a new payroll adjustment
  async create(createPayrollAdjustmentDto: CreatePayrollAdjustmentDto) {
    // Check if the payroll adjustment already exists with the same name and type
    const existingAdjustment = await this.firebaseService.queryCollection(
      'payrollAdjustments',
      'name',
      createPayrollAdjustmentDto.name
    );

    const existingRecord = existingAdjustment.find(
      (record) => record.type === createPayrollAdjustmentDto.type
    );

    if (existingRecord) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Payroll adjustment already exists with the same name and type'),
        HttpStatus.CONFLICT
      );
    }

    const payrollAdjustmentIdCounter = await this.firebaseService.incrementCounter('payrollAdjustmentIdCounter');
    const payrollAdjustmentId = `PRA_${payrollAdjustmentIdCounter}`;

    const payrollAdjustmentData = {
      ...createPayrollAdjustmentDto,
      created_at: Math.floor(Date.now() / 1000), // Timestamp for creation
      updated_at: Math.floor(Date.now() / 1000), // Timestamp for last update
    };

    try {
      // Create the payroll adjustment in Firestore
      await this.firebaseService.createDocument('payrollAdjustments', payrollAdjustmentId, payrollAdjustmentData);
    } catch (error) {
      console.error('Error creating payroll adjustment:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create payroll adjustment'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return createResponse('OK', { id: payrollAdjustmentId, ...payrollAdjustmentData }, 'Payroll adjustment created successfully');
  }

  // Update an existing payroll adjustment
  async update(id: string, updatePayrollAdjustmentDto: UpdatePayrollAdjustmentDto) {
    const existingAdjustment = await this.firebaseService.getDocument('payrollAdjustments', id); // Fetch payroll adjustment by ID

    if (!existingAdjustment) {
      return createResponse('NotFound', 'Payroll adjustment not found');
    }

    // Add the current timestamp for updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const updateData = {
      ...updatePayrollAdjustmentDto,
      updated_at: currentTimestamp, // Set updated_at timestamp
    };

    try {
      // Update the payroll adjustment in Firestore
      await this.firebaseService.updateDocument('payrollAdjustments', id, updateData);
    } catch (error) {
      console.error('Error updating payroll adjustment:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update payroll adjustment'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const updatedAdjustment = await this.firebaseService.getDocument('payrollAdjustments', id);

    return createResponse('OK', updatedAdjustment, 'Payroll adjustment updated successfully');
  }

  // Find all payroll adjustments
  async findAll() {
    try {
      const payrollAdjustments = await this.firebaseService.getCollection('payrollAdjustments');
      console.log('Fetched payroll adjustments:', payrollAdjustments);
      return createResponse('OK', payrollAdjustments);
    } catch (error) {
      console.error('Error fetching payroll adjustments:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch payroll adjustments'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Find one payroll adjustment by ID
  async findOne(id: string) {
    const payrollAdjustment = await this.firebaseService.getDocument('payrollAdjustments', id); // Fetch payroll adjustment by ID

    if (!payrollAdjustment) {
      return createResponse('NotFound', 'Payroll adjustment not found');
    }

    return createResponse('OK', payrollAdjustment, 'Payroll adjustment retrieved successfully');
  }

  // Remove a payroll adjustment by ID
  async remove(id: string) {
    const payrollAdjustment = await this.firebaseService.getDocument('payrollAdjustments', id); // Fetch payroll adjustment by ID

    if (!payrollAdjustment) {
      return createResponse('NotFound', 'Payroll adjustment not found');
    }

    // Delete payroll adjustment from Firestore
    await this.firebaseService.deleteDocument('payrollAdjustments', id);

    return createResponse('OK', `Payroll adjustment with ID ${id} deleted successfully`);
  }
}
