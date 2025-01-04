import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { createResponse } from 'src/utils/functions';
import * as bcrypt from 'bcrypt';


interface User {
  id: string;
  email: string;
  phone: string;
  // other properties...
}


@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createUserDto: CreateUserDto) {
    // Check if the email or phone already exists
    const existingUser = await this.firebaseService.getCollection('users')
    const isEmailOrPhoneTaken = existingUser.some(
      (user: User) =>
        user.email === createUserDto.email || user.phone === createUserDto.phone,
    );

    //If email or phone is taken, throw HttpException
    if (isEmailOrPhoneTaken) return createResponse('DuplicatedRecord', 'Email or phone are taken')
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // Increment the user ID counter and get the next available user ID
    const userId = await this.firebaseService.incrementCounter('userIdCounter');

    // Prepare the user data to be saved to Firestore
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      created_at: Math.floor(Date.now() / 1000),
    };

    // Use the incremented userId (formatted as 'USR_{userId}')
    const userDocumentId = `USR_${userId}`;

    // Create the user document in Firestore
    await this.firebaseService.createDocument('users', userDocumentId, userData);

    // Return the user data with the newly assigned ID
    return createResponse('OK', { id: userDocumentId, ...userData }, 'Successfully created new user')
  }

  async findAll() {
    const data = await this.firebaseService.getCollection('users')
    return createResponse('OK', data)
  }

  async findOne(id: string) {
    const user = await this.firebaseService.getDocument('users', id);
    if (!user) return createResponse('NotFound', 'User Not Found')
    return createResponse('OK', user)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedData = { ...updateUserDto, updated_at: Math.floor(Date.now() / 1000) };
    if (updateUserDto.password) {
      updatedData.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.firebaseService.updateDocument('users', id, updatedData);
    const updatedUser = await this.firebaseService.getDocument('users', id)
    return createResponse('OK', updatedUser)
  }

  async remove(id: string) {
    await this.firebaseService.deleteDocument('users', id);
    return createResponse('OK', 'Deletion Succeeded')
  }
}
