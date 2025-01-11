import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service'; // Firebase service for database operations
import { CreateOvertimeReportDto } from './dto/create-overtime-report.dto';
import { UpdateOvertimeReportDto } from './dto/update-overtime-report.dto';
import { createResponse } from 'src/utils/functions'; // Utility function for structured responses

@Injectable()
export class OvertimeReportsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  // Create a new overtime report
  async create(createOvertimeReportDto: CreateOvertimeReportDto) {
    // Check if the overtime report already exists for the same staff_id and date
    const existingReport = await this.firebaseService.queryCollection(
      'overtimeReports',
      'staff_id',
      createOvertimeReportDto.staff_id
    );

    const existingRecord = existingReport.find(
      (record) => record.date === createOvertimeReportDto.date
    );

    if (existingRecord) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Overtime report already exists for this date and staff'),
        HttpStatus.CONFLICT
      );
    }

    const overtimeReportIdCounter = await this.firebaseService.incrementCounter('overtimeReportIdCounter');
    const overtimeReportId = `OR_${overtimeReportIdCounter}`;

    const overtimeReportData = {
      ...createOvertimeReportDto,
      created_at: Math.floor(Date.now() / 1000), // set creation timestamp
      updated_at: Math.floor(Date.now() / 1000), // set update timestamp
    };

    try {
      // Create the overtime report in Firestore
      await this.firebaseService.createDocument('overtimeReports', overtimeReportId, overtimeReportData);
    } catch (error) {
      console.error('Error creating overtime report:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create overtime report'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return createResponse('OK', { id: overtimeReportId, ...overtimeReportData }, 'Overtime report created successfully');
  }

  // Update an existing overtime report
  async update(id: string, updateOvertimeReportDto: UpdateOvertimeReportDto) {
    const existingReport = await this.firebaseService.getDocument('overtimeReports', id); // Fetch overtime report by ID

    if (!existingReport) {
      return createResponse('NotFound', 'Overtime report not found');
    }

    // Check if an overtime report already exists for the same staff_id and date (excluding the current one)
    const overtimeReports = await this.firebaseService.queryCollection('overtimeReports', 'staff_id', updateOvertimeReportDto.staff_id);
    const existingRecord = overtimeReports.find(
      (record) => record.date === updateOvertimeReportDto.date && record.id !== id
    );

    if (existingRecord) {
      throw new HttpException(
        createResponse('DuplicatedRecord', 'Overtime report already exists for this date and staff'),
        HttpStatus.CONFLICT
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp
    const updateData = {
      ...updateOvertimeReportDto,
      updated_at: currentTimestamp, // Set updated_at timestamp
    };

    try {
      // Update the overtime report in Firestore
      await this.firebaseService.updateDocument('overtimeReports', id, updateData);
    } catch (error) {
      console.error('Error updating overtime report:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update overtime report'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const updatedReport = await this.firebaseService.getDocument('overtimeReports', id);

    return createResponse('OK', updatedReport, 'Overtime report updated successfully');
  }

  // Find all overtime reports
  async findAll() {
    try {
      const overtimeReports = await this.firebaseService.getCollection('overtimeReports');
      console.log('Fetched overtime reports:', overtimeReports);
      return createResponse('OK', overtimeReports);
    } catch (error) {
      console.error('Error fetching overtime reports:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch overtime reports'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllByStaffId(staffId: string) {
    try {
      // Fetch all overtime reports from the database
      const overtimeReports = await this.firebaseService.getCollection('overtimeReports');


      // Filter reports by the provided staffId
      const filteredReports = overtimeReports.filter(report => report.staff_id === staffId);
      console.log('check', filteredReports)

      // Return the filtered reports wrapped in a response object
      return createResponse('OK', filteredReports);
    } catch (error) {
      // If an error occurs, log it and throw an appropriate exception
      console.error('Error fetching overtime reports by staff ID:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch overtime reports for the specified staff ID'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  // Find one overtime report by ID
  async findOne(id: string) {
    const overtimeReport = await this.firebaseService.getDocument('overtimeReports', id); // Fetch overtime report by ID

    if (!overtimeReport) {
      return createResponse('NotFound', 'Overtime report not found');
    }

    return createResponse('OK', overtimeReport, 'Overtime report retrieved successfully');
  }

  // Remove an overtime report by ID
  async remove(id: string) {
    const overtimeReport = await this.firebaseService.getDocument('overtimeReports', id); // Fetch overtime report by ID

    if (!overtimeReport) {
      return createResponse('NotFound', 'Overtime report not found');
    }

    // Delete overtime report from Firestore
    await this.firebaseService.deleteDocument('overtimeReports', id);

    return createResponse('OK', `Overtime report with ID ${id} deleted successfully`);
  }
}
