import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { createResponse } from 'src/utils/functions';
import * as bcrypt from 'bcrypt'


interface Customer {
  id: string;
  email: string;
  phone: string;
  // other properties...
}

@Injectable()
export class CustomersService {
  constructor(private readonly firebaseService: FirebaseService) { }
  async create(createCustomerDto: CreateCustomerDto) {
    console.log('Checking email and phone for existing customers...');
    const existingEmail = await this.firebaseService.queryCollection('customers', 'email', createCustomerDto.email);
    const existingPhone = await this.firebaseService.queryCollection('customers', 'phone', createCustomerDto.phone);

    if (existingEmail.length > 0 || existingPhone.length > 0) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Email or phone are taken'),
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);
    const customerIdCounter = await this.firebaseService.incrementCounter('customerIdCounter');

    const customerData = {
      ...createCustomerDto,
      password: hashedPassword,
      created_at: Math.floor(Date.now() / 1000),
    };

    const customerId = `CUS_${customerIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating customer with data:', { id: customerId, ...customerData });

    try {
      await this.firebaseService.createDocument('customers', customerId, customerData);
    } catch (error) {
      console.error('Error creating customer in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create customer'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: customerId, ...customerData }, 'Customer successfully created');
  }

  async findAll() {
    // Fetch all customers from the 'customers' collection
    const customers = await this.firebaseService.getCollection('customers');

    // Log the fetched customers
    console.log('Fetched customers:', customers);

    // Return the fetched customers
    return createResponse('OK', customers);
  }

  async findOne(id: string) {
    // Fetch the customer document from the 'customers' collection
    const customerDoc = await this.firebaseService.getDocument('customers', id);

    // Check if the customer exists (doc.data() returns the document's data)
    if (!customerDoc) {
      return createResponse('NotFound', 'Customer not found');
    }

    return createResponse('OK', customerDoc, 'Get all customers successfully');

  }



  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    // Check if the customer exists
    const customer = await this.firebaseService.getDocument('customers', id);

    if (!customer) {
      return createResponse('NotFound');
    }

    // If password is provided in the update DTO, hash it
    if (updateCustomerDto.password) {
      const hashedPassword = await bcrypt.hash(updateCustomerDto.password, 10);
      updateCustomerDto.password = hashedPassword; // Replace password with hashed password
    }

    // Convert the UpdateCustomerDto to a plain object to avoid serialization issues
    const updateData = JSON.parse(JSON.stringify(updateCustomerDto));

    // Update the customer document with the provided data (now with hashed password if applicable)
    await this.firebaseService.updateDocument('customers', id, updateData);

    // Fetch the updated customer data to return
    const updatedCustomer = await this.firebaseService.getDocument('customers', id);

    return createResponse('OK', updatedCustomer, 'Updated Customer successfully');
  }




  async remove(id: string) {
    // Check if the customer exists
    const customer = await this.firebaseService.getDocument('customers', id);

    if (!customer) {
      return createResponse('NotFound');
    }

    // Delete the customer document
    await this.firebaseService.deleteDocument('customers', id);

    return createResponse('OK', `Customer with ID ${id} deleted successfully`);
  }

}
