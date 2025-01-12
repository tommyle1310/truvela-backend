import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service'; // Assuming Firebase service is available
import { CreateMonthlyStaffAvailabilityDto } from './dto/create-monthly-staff-schedule.dto';
import { UpdateMonthlyStaffAvailabilityDto } from './dto/update-monthly-staff-schedule.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/utils/functions'; // Assuming you have a function to format consistent responses

@Injectable()
export class MonthlyStaffAvailabilityService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async create(createMonthlyStaffAvailabilityDto: CreateMonthlyStaffAvailabilityDto) {
    // Check if an entry for the given staff_id and month already exists
    const existingAvailability = await this.firebaseService.queryCollection(
      'monthlyStaffAvailability',
      'staff_id',
      createMonthlyStaffAvailabilityDto.staff_id
    );

    if (existingAvailability.length > 0) {
      createResponse('DuplicatedRecord', 'Staff availability record already exists for the given staff ID and month')
    }

    // Increment the counter for monthly staff availability ID if needed
    const availabilityIdCounter = await this.firebaseService.incrementCounter('monthlyStaffAvailabilityIdCounter');

    const availabilityData = {
      ...createMonthlyStaffAvailabilityDto,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const availabilityId = `MSTFS_${availabilityIdCounter}`;

    // Log the data before performing the Firestore operation
    console.log('Creating monthly staff availability with data:', { id: availabilityId, ...availabilityData });

    try {
      // Create the monthly staff availability document in Firestore
      await this.firebaseService.createDocument('monthlyStaffAvailability', availabilityId, availabilityData);
    } catch (error) {
      console.error('Error creating monthly staff availability in Firestore:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to create monthly staff availability'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return createResponse('OK', { id: availabilityId, ...availabilityData }, 'Monthly staff availability successfully created');
  }

  async findAll() {
    // Fetch all monthly staff availability records from the 'monthlyStaffAvailability' collection
    const availabilityRecords = await this.firebaseService.getCollection('monthlyStaffAvailability');
    console.log('Fetched all monthly staff availability records:', availabilityRecords);
    return createResponse('OK', availabilityRecords);
  }

  async findAllGroupByStaff(month: string) {
    // Fetch all monthly staff availability records from the 'monthlyStaffAvailability' collection
    const availabilityRecords = await this.firebaseService.queryCollection('monthlyStaffAvailability', 'month', month);

    // Check if availabilityRecords is empty
    console.log('Fetched availability records:', availabilityRecords);
    if (!availabilityRecords || availabilityRecords.length === 0) {
      console.log('No records found for this month.');
      return createResponse('OK', []);
    }

    // Group availability records by staff_id
    const groupedByStaff = availabilityRecords.reduce((acc, record) => {
      const { staff_id, days, note, created_at, updated_at, month, ...rest } = record;

      // If the staff_id is not in the accumulator, add it
      if (!acc[staff_id]) {
        acc[staff_id] = {
          staff_id,
          note,
          created_at,
          updated_at,
          month,
          days: [],
          ...rest, // You can spread other fields if there are more fields you want to keep
        };
      }

      // Merge the days of the current record with the existing days for this staff_id
      acc[staff_id].days = [...acc[staff_id].days, ...days];

      return acc;
    }, {});

    // For each staff member, fetch the daily availability records for the days array
    const updatedAvailabilityRecords = await Promise.all(
      Object.values(groupedByStaff).map(async (staffRecord) => {
        console.log('Processing staff record:', staffRecord.staff_id); // Log the staff record being processed

        // Fetch daily availability records for the 'days' array in the current staff record
        const dayAvailabilityPromises = staffRecord.days.map(async (dayId) => {
          console.log('check', dayId); // Log each dayId
          try {
            // Fetch the daily availability document for each dayId
            const dayAvailability = await this.firebaseService.getDocument('dailyStaffAvailability', dayId);
            // Return the day availability with its id and staff_id
            return { ...dayAvailability, id: dayId, staff_id: staffRecord.staff_id };
          } catch (error) {
            console.error('Error fetching day availability for dayId:', dayId, error);
            return { id: dayId, error: 'Error fetching document' }; // Return an error object with id
          }
        });

        // Wait for all the daily availability documents to be fetched
        const days = await Promise.all(dayAvailabilityPromises);

        // Remove duplicates based on the `staff_id` for each day
        const uniqueDays = days.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.staff_id === value.staff_id && t.date === value.date
          ))
        );

        // Return the updated staff record with the additional 'days' information
        return {
          ...staffRecord, // Keep the existing properties (including note, created_at, etc.)
          days: uniqueDays, // Add the unique day availability data
        };
      })
    );

    // Return the response with the updated availability records
    return createResponse('OK', updatedAvailabilityRecords);
  }

  async findAllGroupByDate(month: string) {
    console.log('Function called'); // Check if function is called

    // Fetch all monthly staff availability records from the 'monthlyStaffAvailability' collection
    const availabilityRecords = await this.firebaseService.queryCollection('monthlyStaffAvailability', 'month', month);

    console.log('Fetched availability records:', availabilityRecords); // Check what data is being fetched

    if (!availabilityRecords || availabilityRecords.length === 0) {
      console.log('No records found for this month.');
      return createResponse('NotFound', []);
    }

    // Create an object to group by date
    const groupedByDate = {};

    // Create an array of promises for each day fetching
    const dayAvailabilityPromises = [];

    // Iterate over the availability records
    for (const record of availabilityRecords) {
      // For each record, process the days
      for (const dayId of record.days) {
        // Add the promise to the array
        const dayAvailability = this.firebaseService.getDocument('dailyStaffAvailability', dayId).then(async (dayData) => {
          console.log('Day data fetched:', dayData); // Check if day data is fetched

          const { date, staff_id, status, blocked_time, attended_hours, shift, created_at, updated_at } = dayData;

          try {
            // Fetch staff details using staff_id
            const staffData = await this.firebaseService.getDocument('staffs', staff_id);
            console.log('Staff data fetched:', staffData); // Check staff data

            const { first_name, last_name, email, avatar, department } = staffData;

            // Fetch department details using department ID
            const departmentDetails = await this.firebaseService.getDocument('departments', department);
            console.log('Department data fetched:', departmentDetails); // Check department data

            // Fetch shift name using shift ID from 'staffShifts'
            const shiftData = await this.firebaseService.getDocument('staffShifts', shift);
            console.log('Shift data fetched:', shiftData); // Check shift data

            const shift_name = shiftData ? shiftData.shift_type : '';  // Handle if shift data is missing
            console.log('Shift name:', shift_name); // Check the shift name

            // If the date is not already in the groupedByDate object, initialize it
            if (!groupedByDate[date]) {
              groupedByDate[date] = {
                date,
                staffs: [],
                note: record.note,
                created_at: record.created_at,
                updated_at: record.updated_at,
                month: record.month,
              };
            }

            // Push the staff availability data along with staff, department, and shift details to the date group
            groupedByDate[date].staffs.push({
              staff_id,
              first_name,
              last_name,
              email,
              avatar,
              department: departmentDetails,
              status,
              blocked_time,
              attended_hours,
              shift,
              shift_name, // Add the shift name here
              created_at,
              updated_at,
              id: dayId // Include the day ID
            });
          } catch (error) {
            console.error('Error fetching staff, department, or shift details:', error);
          }
        }).catch((error) => {
          console.error('Error fetching daily availability:', error);
        });

        // Push the promise to the array to track completion
        dayAvailabilityPromises.push(dayAvailability);
      }
    }

    // Wait for all promises to resolve (both staff details, department details, day availability, and shift details)
    await Promise.all(dayAvailabilityPromises)
      .then(() => {
        console.log('All promises resolved');
      })
      .catch((error) => {
        console.error('Error in Promise.all:', error);
      });

    // Now that all async operations are complete, log the final grouped result
    console.log('Grouped by date with staff, department, and shift details:', groupedByDate);

    // Convert groupedByDate to an array of the grouped data by date
    const groupedData = Object.values(groupedByDate);

    return createResponse('OK', groupedData);
  }






  async findOne(id: string) {
    const availabilityDoc = await this.firebaseService.getDocument('monthlyStaffAvailability', id);

    if (!availabilityDoc) {
      return createResponse('NotFound', 'Monthly staff availability not found');
    }

    return createResponse('OK', availabilityDoc, 'Fetched monthly staff availability successfully');
  }

  async update(id: string, updateMonthlyStaffAvailabilityDto: UpdateMonthlyStaffAvailabilityDto) {
    // Check if the monthly staff availability exists
    const availability = await this.firebaseService.getDocument('monthlyStaffAvailability', id);

    if (!availability) {
      return createResponse('NotFound', 'Monthly staff availability not found');
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Prepare the update data, including the current timestamp
    const updateData = {
      ...JSON.parse(JSON.stringify(updateMonthlyStaffAvailabilityDto)),
      updated_at: currentTimestamp,
    };

    // Check if the month is already set in the record (to ensure we're checking only when month exists)
    if (availability.month) {
      // If the month exists, check if the staff_id is already associated with this month
      const existingAvailability = await this.firebaseService.queryCollection(
        'monthlyStaffAvailability',
        'staff_id',
        updateMonthlyStaffAvailabilityDto.staff_id
      );

      // If any existing availability record exists with the same staff_id and the same month, throw error
      if (
        existingAvailability.length > 0 &&
        existingAvailability[0].month === updateMonthlyStaffAvailabilityDto.month &&
        existingAvailability[0].staff_id === updateMonthlyStaffAvailabilityDto.staff_id
      ) {
        return createResponse('DuplicatedRecord', 'Staff availability record already exists for the given staff ID and month');
      }
    }

    try {
      // Update the monthly staff availability document in Firestore
      await this.firebaseService.updateDocument('monthlyStaffAvailability', id, updateData);
    } catch (error) {
      console.error('Error updating monthly staff availability:', error);
      throw new HttpException(
        createResponse('ServerError', 'Failed to update monthly staff availability'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Fetch the updated availability data
    const updatedAvailability = await this.firebaseService.getDocument('monthlyStaffAvailability', id);

    return createResponse('OK', updatedAvailability, 'Updated monthly staff availability successfully');
  }


  async remove(id: string) {
    const availability = await this.firebaseService.getDocument('monthlyStaffAvailability', id);

    if (!availability) {
      return createResponse('NotFound', 'Monthly staff availability not found');
    }

    await this.firebaseService.deleteDocument('monthlyStaffAvailability', id);

    return createResponse('OK', `Monthly staff availability with ID ${id} deleted successfully`);
  }
}
