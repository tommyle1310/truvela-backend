import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming you have this Firebase service
import { createResponse } from 'src/utils/functions'; // Assuming you have this helper for creating consistent responses

@Injectable()
export class ServiceCategoriesService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createServiceCategoryDto: CreateServiceCategoryDto) {
    // Check if the service category with the same name already exists
    const existingCategory = await this.firebaseService.queryCollection('serviceCategories', 'name', createServiceCategoryDto.name);

    if (existingCategory.length > 0) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Service category name already exists'),
        HttpStatus.CONFLICT,
      );
    }

    // Increment the counter for service category ID if needed
    const serviceCategoryIdCounter = await this.firebaseService.incrementCounter('serviceCategoryIdCounter');

    const serviceCategoryData = {
      ...createServiceCategoryDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const serviceCategoryId = `SC_${serviceCategoryIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating service category with data:', { id: serviceCategoryId, ...serviceCategoryData });

    try {
      // Create the service category document in Firestore
      await this.firebaseService.createDocument('serviceCategories', serviceCategoryId, serviceCategoryData);
    } catch (error) {
      console.error('Error creating service category in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create service category'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: serviceCategoryId, ...serviceCategoryData }, 'Service category successfully created');
  }

  async findAll() {
    // Fetch all service categories from the 'serviceCategories' collection
    const serviceCategories = await this.firebaseService.getCollection('serviceCategories');

    // Log the fetched service categories
    console.log('Fetched service categories:', serviceCategories);

    // Return the fetched service categories
    return createResponse('OK', serviceCategories);
  }

  async findOne(id: string) {
    // Fetch the service category document from the 'serviceCategories' collection
    const serviceCategoryDoc = await this.firebaseService.getDocument('serviceCategories', id);

    // Check if the service category exists
    if (!serviceCategoryDoc) {
      return createResponse('NotFound', 'Service category not found');
    }

    return createResponse('OK', serviceCategoryDoc, 'Fetched service category successfully');
  }

  async update(id: string, updateServiceCategoryDto: UpdateServiceCategoryDto) {
    // Check if the service category exists
    const serviceCategory = await this.firebaseService.getDocument('serviceCategories', id);

    if (!serviceCategory) {
      return createResponse('NotFound', 'Service category not found');
    }

    // Add the current timestamp for the updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Convert the UpdateServiceCategoryDto to a plain object and include updated_at
    const updateData = {
      ...JSON.parse(JSON.stringify(updateServiceCategoryDto)),
      updated_at: currentTimestamp, // Add the updated_at timestamp
    };

    // Update the service category document with the provided data
    try {
      await this.firebaseService.updateDocument('serviceCategories', id, updateData);
    } catch (error) {
      console.error('Error updating service category:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update service category'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Fetch the updated service category data to return
    const updatedServiceCategory = await this.firebaseService.getDocument('serviceCategories', id);

    return createResponse('OK', updatedServiceCategory, 'Updated service category successfully');
  }


  async remove(id: string) {
    // Check if the service category exists
    const serviceCategory = await this.firebaseService.getDocument('serviceCategories', id);

    if (!serviceCategory) {
      return createResponse('NotFound', 'Service category not found');
    }

    // Delete the service category document
    await this.firebaseService.deleteDocument('serviceCategories', id);

    return createResponse('OK', `Service category with ID ${id} deleted successfully`);
  }
}
