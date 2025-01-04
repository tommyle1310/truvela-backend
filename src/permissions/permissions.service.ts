import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming you use FirebaseService
import { createResponse } from 'src/utils/functions'; // Your utility for structured responses

@Injectable()
export class PermissionsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  // Create a new permission
  async create(createPermissionDto: CreatePermissionDto) {
    console.log('Checking for existing permission...');
    const existingPermission = await this.firebaseService.queryCollection('permissions', 'name', createPermissionDto.name);

    if (existingPermission.length > 0) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Permission name is taken'),
        HttpStatus.CONFLICT,
      );
    }
    const permissionIdCounter = await this.firebaseService.incrementCounter('permissionIdCounter');


    const permissionId = `PER_${permissionIdCounter}`; // Generate a unique permission ID (can also use Firebase auto-id)

    const permissionData = {
      ...createPermissionDto,
      created_at: Math.floor(Date.now() / 1000),
    };

    // Log the data before performing the Firestore operation
    console.log('Creating permission with data:', { id: permissionId, ...permissionData });

    try {
      await this.firebaseService.createDocument('permissions', permissionId, permissionData);
    } catch (error) {
      console.error('Error creating permission in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create permission'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: permissionId, ...permissionData }, 'Permission successfully created');
  }

  // Get all permissions
  async findAll() {
    const permissions = await this.firebaseService.getCollection('permissions');

    // Log the fetched permissions
    console.log('Fetched permissions:', permissions);

    return createResponse('OK', permissions);
  }

  // Get a specific permission by ID
  async findOne(id: string) {
    const permissionDoc = await this.firebaseService.getDocument('permissions', id);

    if (!permissionDoc) {
      return createResponse('NotFound', 'Permission not found');
    }

    return createResponse('OK', permissionDoc, 'Permission retrieved successfully');
  }

  // Update an existing permission
  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.firebaseService.getDocument('permissions', id);

    if (!permission) {
      return createResponse('NotFound', 'Permission not found');
    }

    // Convert the UpdatePermissionDto to a plain object to avoid serialization issues
    const updateData = JSON.parse(JSON.stringify(updatePermissionDto));

    try {
      await this.firebaseService.updateDocument('permissions', id, updateData);
    } catch (error) {
      console.error('Error updating permission in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update permission'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Fetch the updated permission data to return
    const updatedPermission = await this.firebaseService.getDocument('permissions', id);

    return createResponse('OK', updatedPermission, 'Permission updated successfully');
  }

  // Remove a permission by ID
  async remove(id: string) {
    const permission = await this.firebaseService.getDocument('permissions', id);

    if (!permission) {
      return createResponse('NotFound', 'Permission not found');
    }

    try {
      await this.firebaseService.deleteDocument('permissions', id);
    } catch (error) {
      console.error('Error deleting permission in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to delete permission'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', `Permission with ID ${id} deleted successfully`);
  }
}
