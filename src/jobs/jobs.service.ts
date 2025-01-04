import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming you're using FirebaseService
import { createResponse } from 'src/utils/functions'; // Utility for structured responses

@Injectable()
export class JobsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  // Create a new job
  async create(createJobDto: CreateJobDto) {
    console.log('Checking for existing job...');

    // Check if the job title already exists in Firebase
    const existingJob = await this.firebaseService.queryCollection('jobs', 'title', createJobDto.title);

    if (existingJob.length > 0) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Job title is already taken'),
        HttpStatus.CONFLICT,
      );
    }

    // Increment job ID counter
    const jobIdCounter = await this.firebaseService.incrementCounter('jobIdCounter');
    const jobId = `JOB_${jobIdCounter}`; // Generate a unique job ID

    const jobData = {
      ...createJobDto,
      created_at: Math.floor(Date.now() / 1000), // Set creation timestamp
    };

    // Log the data before performing the Firestore operation
    console.log('Creating job with data:', { id: jobId, ...jobData });

    try {
      await this.firebaseService.createDocument('jobs', jobId, jobData); // Store job in Firestore
    } catch (error) {
      console.error('Error creating job in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create job'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createResponse('OK', { id: jobId, ...jobData }, 'Job successfully created');
  }

  // Get all jobs
  async findAll() {
    try {
      const jobs = await this.firebaseService.getCollection('jobs'); // Fetch all jobs
      console.log('Fetched jobs:', jobs);
      return createResponse('OK', jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch jobs'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get a specific job by ID
  async findOne(id: string) {
    const job = await this.firebaseService.getDocument('jobs', id); // Fetch job by ID

    if (!job) {
      return createResponse('NotFound', 'Job not found');
    }

    return createResponse('OK', job, 'Job retrieved successfully');
  }

  // Update an existing job
  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.firebaseService.getDocument('jobs', id); // Fetch job by ID

    if (!job) {
      return createResponse('NotFound', 'Job not found');
    }

    // Convert the UpdateJobDto to a plain object to avoid serialization issues
    const updateData = JSON.parse(JSON.stringify(updateJobDto));

    // Update job in Firestore
    await this.firebaseService.updateDocument('jobs', id, updateData);

    // Fetch the updated job data
    const updatedJob = await this.firebaseService.getDocument('jobs', id);

    return createResponse('OK', updatedJob, 'Job updated successfully');
  }

  // Remove a job by ID
  async remove(id: string) {
    const job = await this.firebaseService.getDocument('jobs', id); // Fetch job by ID

    if (!job) {
      return createResponse('NotFound', 'Job not found');
    }

    // Delete job from Firestore
    await this.firebaseService.deleteDocument('jobs', id);

    return createResponse('OK', `Job with ID ${id} deleted successfully`);
  }
}
