import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createUserDto: CreateUserDto) {

    // Increment the user ID counter and get the next available user ID
    const userId = await this.firebaseService.incrementUserIdCounter();

    // Prepare the user data to be saved to Firestore
    const userData = {
      ...createUserDto,
      created_at: new Date().toISOString(),
    };

    // Use the incremented userId (formatted as 'USR_{userId}')
    const userDocumentId = `USR_${userId}`;

    // Create the user document in Firestore
    await this.firebaseService.createDocument('users', userDocumentId, userData);

    // Return the user data with the newly assigned ID
    return { id: userDocumentId, ...userData };
  }


  async findAll() {
    return this.firebaseService.getCollection('users');
  }

  async findOne(id: string) {
    return this.firebaseService.getDocument('users', id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedData = { ...updateUserDto, updated_at: new Date().toISOString() };
    await this.firebaseService.updateDocument('users', id, updatedData);
    return { id, ...updatedData };
  }

  async remove(id: string) {
    return this.firebaseService.deleteDocument('users', id);
  }
}
