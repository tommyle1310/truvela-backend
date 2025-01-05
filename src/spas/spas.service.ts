import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSpaDto } from './dto/create-spa.dto';
import { UpdateSpaDto } from './dto/update-spa.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming Firebase service is available
import { createResponse } from 'src/utils/functions'; // Assuming you have a function to format consistent responses

@Injectable()
export class SpasService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createSpaDto: CreateSpaDto) {
    // Check if the spa with the same name already exists
    const existingSpa = await this.firebaseService.queryCollection('spas', 'name', createSpaDto.name);

    if (existingSpa.length > 0) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Spa name already exists'),
        HttpStatus.CONFLICT,
      );
    }

    // Increment the counter for spa ID if needed
    const spaIdCounter = await this.firebaseService.incrementCounter('spaIdCounter');

    const spaData = {
      ...createSpaDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const spaId = `SPA_${spaIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating spa with data:', { id: spaId, ...spaData });

    try {
      // Create the spa document in Firestore
      await this.firebaseService.createDocument('spas', spaId, spaData);
    } catch (error) {
      console.error('Error creating spa in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create spa'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: spaId, ...spaData }, 'Spa successfully created');
  }

  async findAll() {
    // Fetch all spas from the 'spas' collection
    const spas = await this.firebaseService.getCollection('spas');

    // Log the fetched spas
    console.log('Fetched spas:', spas);

    // Return the fetched spas
    return createResponse('OK', spas);
  }

  async findOne(id: string) {
    // Fetch the spa document from the 'spas' collection
    const spaDoc = await this.firebaseService.getDocument('spas', id);

    // Check if the spa exists
    if (!spaDoc) {
      return createResponse('NotFound', 'Spa not found');
    }

    return createResponse('OK', spaDoc, 'Fetched spa successfully');
  }

  async update(id: string, updateSpaDto: UpdateSpaDto) {
    // Check if the spa exists
    const spa = await this.firebaseService.getDocument('spas', id);

    if (!spa) {
      return createResponse('NotFound', 'Spa not found');
    }

    // Add the current timestamp for the updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Convert the UpdateSpaDto to a plain object and include updated_at
    const updateData = {
      ...JSON.parse(JSON.stringify(updateSpaDto)),
      updated_at: currentTimestamp, // Add the updated_at timestamp
    };

    // Update the spa document with the provided data
    try {
      await this.firebaseService.updateDocument('spas', id, updateData);
    } catch (error) {
      console.error('Error updating spa:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update spa'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Fetch the updated spa data to return
    const updatedSpa = await this.firebaseService.getDocument('spas', id);

    return createResponse('OK', updatedSpa, 'Updated spa successfully');
  }

  async remove(id: string) {
    // Check if the spa exists
    const spa = await this.firebaseService.getDocument('spas', id);

    if (!spa) {
      return createResponse('NotFound', 'Spa not found');
    }

    // Delete the spa document
    await this.firebaseService.deleteDocument('spas', id);

    return createResponse('OK', `Spa with ID ${id} deleted successfully`);
  }
}
