import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming Firebase service is available
import { createResponse } from 'src/utils/functions'; // Utility for structured responses
import { Enum_PayrollStatus } from 'src/utils/enums'; // Assuming Enum_PayrollStatus is defined elsewhere

@Injectable()
export class PayrollsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  // Create a new payroll entry
  async create(createPayrollDto: CreatePayrollDto) {
    // Check if a payroll record already exists for the same staff_id and pay_period_start
    const existingPayroll = await this.firebaseService.queryCollection(
      'payrolls',
      'staff_id',
      createPayrollDto.staff_id
    );

    const existingRecord = existingPayroll.find(
      (record) => record.pay_period_start === createPayrollDto.pay_period_start
    );

    if (existingRecord) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Payroll record already exists for the given staff and pay period'),
        HttpStatus.CONFLICT,
      );
    }

    // Increment the counter for payroll ID
    const payrollIdCounter = await this.firebaseService.incrementCounter('payrollIdCounter');
    const payrollId = `PR_${payrollIdCounter}`;

    // Prepare the payroll data to be stored
    const payrollData = {
      ...createPayrollDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    try {
      // Create the payroll record in Firestore
      await this.firebaseService.createDocument('payrolls', payrollId, payrollData);
    } catch (error) {
      console.error('Error creating payroll:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create payroll record'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: payrollId, ...payrollData }, 'Payroll record created successfully');
  }

  // Get all payroll records
  async findAll() {
    try {
      const payrolls = await this.firebaseService.getCollection('payrolls'); // Fetch all payroll records
      return createResponse('OK', payrolls);
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch payroll records'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get a specific payroll record by ID
  async findOne(id: string) {
    const payroll = await this.firebaseService.getDocument('payrolls', id); // Fetch payroll by ID

    if (!payroll) {
      return createResponse('NotFound', 'Payroll record not found');
    }

    return createResponse('OK', payroll, 'Payroll record retrieved successfully');
  }

  // Update an existing payroll entry
  async update(id: string, updatePayrollDto: UpdatePayrollDto) {
    const payroll = await this.firebaseService.getDocument('payrolls', id); // Fetch payroll by ID

    if (!payroll) {
      return createResponse('NotFound', 'Payroll record not found');
    }

    // Check if another payroll with the same staff_id and pay_period_start exists (excluding the current one)
    const existingPayroll = await this.firebaseService.queryCollection(
      'payrolls',
      'staff_id',
      updatePayrollDto.staff_id
    );

    const existingRecord = existingPayroll.find(
      (record) =>
        record.pay_period_start === updatePayrollDto.pay_period_start && record.id !== id
    );

    if (existingRecord) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Payroll record already exists for the given staff and pay period'),
        HttpStatus.CONFLICT,
      );
    }

    // Add the current timestamp for updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const updateData = {
      ...JSON.parse(JSON.stringify(updatePayrollDto)),
      updated_at: currentTimestamp,
    };

    try {
      // Update the payroll record in Firestore
      await this.firebaseService.updateDocument('payrolls', id, updateData);
    } catch (error) {
      console.error('Error updating payroll:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update payroll record'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Fetch the updated payroll data to return
    const updatedPayroll = await this.firebaseService.getDocument('payrolls', id);

    return createResponse('OK', updatedPayroll, 'Updated payroll record successfully');
  }

  // Remove a payroll entry by ID
  async remove(id: string) {
    const payroll = await this.firebaseService.getDocument('payrolls', id); // Fetch payroll by ID

    if (!payroll) {
      return createResponse('NotFound', 'Payroll record not found');
    }

    // Delete the payroll record from Firestore
    await this.firebaseService.deleteDocument('payrolls', id);

    return createResponse('OK', `Payroll record with ID ${id} deleted successfully`);
  }
}
