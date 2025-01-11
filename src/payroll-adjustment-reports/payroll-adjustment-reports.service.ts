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
      // Fetch payroll adjustment reports for the given staffId
      const payrollAdjustmentReports = await this.firebaseService.queryCollection('payrollAdjustmentReports', 'staff_id', staffId);

      // Prepare an empty object to dynamically hold the data for different types
      const groupedData = {};

      // Fetch staff details using the provided staffId
      const staff = await this.firebaseService.getDocument('staffs', `${staffId}`);
      const staffEmail = staff ? staff.email : null;

      // Loop through each payroll adjustment report for the staff
      for (const report of payrollAdjustmentReports) {
        // Fetch the payroll adjustment document
        const payrollAdjustment = await this.firebaseService.getDocument('payrollAdjustments', report.payroll_adjustment);
        const payrollAdjustmentType = payrollAdjustment ? payrollAdjustment.type : null;

        // Dynamically initialize the type in groupedData if it doesn't exist yet
        if (!groupedData[payrollAdjustmentType]) {
          groupedData[payrollAdjustmentType] = {
            type: payrollAdjustmentType,
            staff_id: staffId,
            staff_email: staffEmail,
            payroll_adjustment_reports: [],
          };
        }

        // Add payroll adjustment report to the corresponding type
        groupedData[payrollAdjustmentType].payroll_adjustment_reports.push({
          name: payrollAdjustment.name,
          type: payrollAdjustment.type,
          id: report.payroll_adjustment,
          amount: payrollAdjustment.amount,
          updated_at: payrollAdjustment.updated_at,
        });

        // Handle overtime reports if they exist
        if (report.overtime_report) {
          const overtimeReport = await this.firebaseService.getDocument('overtimeReports', report.overtime_report);

          if (overtimeReport && overtimeReport.staff_id === staffId) {
            // Ensure 'Overtime' type exists and add overtime report details
            if (!groupedData['Overtime']) {
              groupedData['Overtime'] = {
                type: 'Overtime',
                staff_id: staffId,
                staff_email: staffEmail,
                overtime_reports: [],
              };
            }
            // Push overtime report details related to the provided staffId
            groupedData['Overtime'].overtime_reports.push({
              staff_id: overtimeReport.staff_id,
              date: overtimeReport.date,
              overtime_hour: overtimeReport.overtime_hour,
              created_at: overtimeReport.created_at,
              updated_at: overtimeReport.updated_at,
            });
          }
        }
      }

      // Convert the groupedData object to an array
      const responseData = Object.values(groupedData);

      // Return the formatted response
      return createResponse('OK', responseData);

    } catch (error) {
      console.error('Error fetching payroll adjustment reports:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to fetch payroll adjustment reports'),
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
