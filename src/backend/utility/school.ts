import { connectMongoDB } from '../lib/mongodb';
import School, { ISchool } from '../models/School';
import User, { IUser } from '../models/User';

/**
 * School database utility functions
 */

// Create a new school
export async function createSchool(schoolData: Omit<ISchool, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectMongoDB();
    const school = new School(schoolData);
    await school.save();
    return school;
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
}

// Find school by EIIN
export async function findSchoolByEIIN(eiin: string) {
  try {
    await connectMongoDB();
    return await School.findOne({ EIIN: eiin });
  } catch (error) {
    console.error('Error finding school by EIIN:', error);
    throw error;
  }
}

// Find school by ID
export async function findSchoolById(id: string) {
  try {
    await connectMongoDB();
    return await School.findById(id);
  } catch (error) {
    console.error('Error finding school by ID:', error);
    throw error;
  }
}

// Get all schools
export async function getAllSchools() {
  try {
    await connectMongoDB();
    return await School.find({});
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
}

// Update school
export async function updateSchool(id: string, updateData: Partial<ISchool>) {
  try {
    await connectMongoDB();
    return await School.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error('Error updating school:', error);
    throw error;
  }
}

// Delete school (soft delete by setting a flag, or hard delete)
export async function deleteSchool(id: string) {
  try {
    await connectMongoDB();
    // Hard delete - removes the school completely
    return await School.findByIdAndDelete(id);
  } catch (error) {
    console.error('Error deleting school:', error);
    throw error;
  }
}

// Check if school exists by EIIN
export async function schoolExistsByEIIN(eiin: string) {
  try {
    await connectMongoDB();
    const school = await School.findOne({ EIIN: eiin });
    return !!school;
  } catch (error) {
    console.error('Error checking if school exists:', error);
    throw error;
  }
}