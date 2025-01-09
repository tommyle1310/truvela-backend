import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service'; // Firebase service for database operations
import { CreatePayrollAdjustmentReportDto } from './dto/create-payroll-adjustment-report.dto';
import { UpdatePayrollAdjustmentReportDto } from './dto/update-payroll-adjustment-report.dto';
import { createResponse } from 'src/utils/functions'; // Utility function for structured responses

@Injectable()
export class PayrollAdjustmentReportsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  // Create a new payroll adjustment report
  async create(createPayrollAdjustmentReportDto: CreatePayrollAdjustmentReportDto) {
    const payrollAdjustmentReportIdCounter = await this.firebaseService.incrementCounter('payrollAdjustmentReportIdCounter');
    const payrollAdjustmentReportId = `PRAR_${payrollAdjustmentReportIdCounter}`;

    const payrollAdjustmentReportData = {
      ...createPayrollAdjustmentReportDto,
      created_at: Math.floor(Date.now() / 1000), // Timestamp for creation
      updated_at: Math.floor(Date.now() / 1000), // Timestamp for last update
    };

    try {
      // Create the payroll adjustment report in Firestore
      await this.firebaseService.createDocument('payrollAdjustmentReports', payrollAdjustmentReportId, payrollAdjustmentReportData);
    } catch (error) {
      console.error('Error creating payroll adjustment report:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create payroll adjustment report'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return createResponse('OK', { id: payrollAdjustmentReportId, ...payrollAdjustmentReportData }, 'Payroll adjustment report created successfully');
  }

  // Update an existing payroll adjustment report
  async update(id: string, updatePayrollAdjustmentReportDto: UpdatePayrollAdjustmentReportDto) {
    const existingReport = await this.firebaseService.getDocument('payrollAdjustmentReports', id); // Fetch payroll adjustment report by ID

    if (!existingReport) {
      return createResponse('NotFound', 'Payroll adjustment report not found');
    }

    // Add the current timestamp for updated_at field
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const updateData = {
      ...updatePayrollAdjustmentReportDto,
      updated_at: currentTimestamp, // Set updated_at timestamp
    };

    try {
      // Update the payroll adjustment report in Firestore
      await this.firebaseService.updateDocument('payrollAdjustmentReports', id, updateData);
    } catch (error) {
      console.error('Error updating payroll adjustment report:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update payroll adjustment report'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const updatedReport = await this.firebaseService.getDocument('payrollAdjustmentReports', id);

    return createResponse('OK', updatedReport, 'Payroll adjustment report updated successfully');
  }

  // Find all payroll adjustment reports
  async findAll() {
    try {
      const payrollAdjustmentReports = await this.firebaseService.getCollection('payrollAdjustmentReports');
      console.log('Fetched payroll adjustment reports:', payrollAdjustmentReports);
      return createResponse('OK', payrollAdjustmentReports);
    } catch (error) {
      console.error('Error fetching payroll adjustment reports:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch payroll adjustment reports'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllByStaffId(staffId: string) {
    try {
      // Fetch payroll adjustment reports filtered by the given staffId
      const payrollAdjustmentReports = await this.firebaseService.queryCollection('payrollAdjustmentReports', 'staff_id', staffId);
      console.log('Fetched payroll adjustment reports by staffId:', payrollAdjustmentReports);

      // Fetch the corresponding payroll adjustment details for each report
      const payrollAdjustmentReportsWithDetails = await Promise.all(payrollAdjustmentReports.map(async (report) => {
        // Fetch payroll adjustment details using the payroll_adjustment ID
        const payrollAdjustmentDetails = await this.firebaseService.getDocument('payrollAdjustments', report.payroll_adjustment);

        // Fetch staff details using staff_id from the payroll report
        const staffDetails = await this.firebaseService.getDocument('staffs', report.staff_id);

        // Ensure 'payroll_adjustment' ID is retained in the structure
        return {
          ...report,  // Spread the existing report data
          payroll_adjustment_details: payrollAdjustmentDetails,  // Add the payroll adjustment details
          staff_name: `${staffDetails.first_name} ${staffDetails.last_name}`, // Construct staff name
          staff_id: staffDetails.id, // Add staff_id
          staff_email: staffDetails.email, // Include staff email (if needed)
          notes: report.notes, // Ensure 'notes' is included from the payroll report
          payroll_adjustment: report.payroll_adjustment // Explicitly keep the 'payroll_adjustment' ID
        };
      }));

      // Group by the type of payroll adjustment (e.g., 'Reimbursement', 'Bonus')
      const groupedByType = payrollAdjustmentReportsWithDetails.reduce((acc, report) => {
        const type = report.payroll_adjustment_details.type;

        // If the type group does not exist, create it
        if (!acc[type]) {
          acc[type] = {
            type,  // Store the type
            adjustments: [], // Hold the adjustments for that type
          };
        }

        // Add the report to the corresponding type group
        acc[type].adjustments.push({
          name: report.payroll_adjustment_details.name,
          amount: report.payroll_adjustment_details.amount,
          staff_name: report.staff_name,
          payroll_adjustment_id: report.payroll_adjustment,  // Now it has payroll_adjustment ID
          staff_id: report.staff_id,
          description: report.payroll_adjustment_details.description,
          createdAt: report.payroll_adjustment_details.created_at,
          updatedAt: report.payroll_adjustment_details.updated_at,
          notes: report.notes, // Add 'notes' here
        });

        return acc;
      }, {});

      // Convert the grouped result back into an array
      const groupedData = Object.values(groupedByType);

      return createResponse('OK', groupedData);
    } catch (error) {
      console.error('Error fetching payroll adjustment reports by staffId:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch payroll adjustment reports by staffId'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }





  // Find one payroll adjustment report by ID
  async findOne(id: string) {
    const payrollAdjustmentReport = await this.firebaseService.getDocument('payrollAdjustmentReports', id); // Fetch payroll adjustment report by ID

    if (!payrollAdjustmentReport) {
      return createResponse('NotFound', 'Payroll adjustment report not found');
    }

    return createResponse('OK', payrollAdjustmentReport, 'Payroll adjustment report retrieved successfully');
  }

  // Remove a payroll adjustment report by ID
  async remove(id: string) {
    const payrollAdjustmentReport = await this.firebaseService.getDocument('payrollAdjustmentReports', id); // Fetch payroll adjustment report by ID

    if (!payrollAdjustmentReport) {
      return createResponse('NotFound', 'Payroll adjustment report not found');
    }

    // Delete payroll adjustment report from Firestore
    await this.firebaseService.deleteDocument('payrollAdjustmentReports', id);

    return createResponse('OK', `Payroll adjustment report with ID ${id} deleted successfully`);
  }
}
