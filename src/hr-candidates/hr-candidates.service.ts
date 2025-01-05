import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHrCandidateDto } from './dto/create-hr-candidate.dto';
import { UpdateHrCandidateDto } from './dto/update-hr-candidate.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming Firebase service is available
import { createResponse } from 'src/utils/functions'; // Assuming you have a function to format consistent responses

@Injectable()
export class HrCandidatesService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createHrCandidateDto: CreateHrCandidateDto) {

    // Increment the counter for HR candidate ID if needed
    const candidateIdCounter = await this.firebaseService.incrementCounter('hrCandidateIdCounter');

    const hrCandidateData = {
      ...createHrCandidateDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const candidateId = `HR_CAND_${candidateIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating HR candidate with data:', { id: candidateId, ...hrCandidateData });

    try {
      // Create the HR candidate document in Firestore
      await this.firebaseService.createDocument('hrCandidates', candidateId, hrCandidateData);
    } catch (error) {
      console.error('Error creating HR candidate in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create HR candidate'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: candidateId, ...hrCandidateData }, 'HR candidate successfully created');
  }

  async findAll() {
    // Fetch all HR candidates from the 'hrCandidates' collection
    const hrCandidates = await this.firebaseService.getCollection('hrCandidates');

    // Log the fetched HR candidates
    console.log('Fetched HR candidates:', hrCandidates);

    // Return the fetched HR candidates
    return createResponse('OK', hrCandidates);
  }

  async findOne(id: string) {
    // Fetch the HR candidate document from the 'hrCandidates' collection
    const hrCandidateDoc = await this.firebaseService.getDocument('hrCandidates', id);

    // Check if the HR candidate exists
    if (!hrCandidateDoc) {
      return createResponse('NotFound', 'HR candidate not found');
    }

    return createResponse('OK', hrCandidateDoc, 'Fetched HR candidate successfully');
  }

  async update(id: string, updateHrCandidateDto: UpdateHrCandidateDto) {
    // Check if the HR candidate exists
    const hrCandidate = await this.firebaseService.getDocument('hrCandidates', id);

    if (!hrCandidate) {
      return createResponse('NotFound', 'HR candidate not found');
    }

    // Add the current timestamp for updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Convert the UpdateHrCandidateDto to a plain object and include updated_at
    const updateData = {
      ...JSON.parse(JSON.stringify(updateHrCandidateDto)),
      updated_at: currentTimestamp, // Add the updated_at timestamp
    };

    // Update the HR candidate document with the provided data
    try {
      await this.firebaseService.updateDocument('hrCandidates', id, updateData);
    } catch (error) {
      console.error('Error updating HR candidate:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update HR candidate'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Fetch the updated HR candidate data to return
    const updatedHrCandidate = await this.firebaseService.getDocument('hrCandidates', id);

    return createResponse('OK', updatedHrCandidate, 'Updated HR candidate successfully');
  }

  async remove(id: string) {
    // Check if the HR candidate exists
    const hrCandidate = await this.firebaseService.getDocument('hrCandidates', id);

    if (!hrCandidate) {
      return createResponse('NotFound', 'HR candidate not found');
    }

    // Delete the HR candidate document
    await this.firebaseService.deleteDocument('hrCandidates', id);

    return createResponse('OK', `HR candidate with ID ${id} deleted successfully`);
  }
}
