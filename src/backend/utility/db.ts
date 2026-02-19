import { connectMongoDB } from '../lib/mongodb';
import User, { IUser } from '../models/User';

/**
 * Database utility functions
 */

// Connect to MongoDB
export async function initializeDatabase() {
  try {
    await connectMongoDB();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// User operations
export async function createUser(userData: Omit<IUser, 'createdAt' | 'updatedAt'>) {
  try {
    await connectMongoDB();
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  try {
    await connectMongoDB();
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    await connectMongoDB();
    return await User.find({ isActive: true }).select('-password');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function updateUser(id: string, updateData: Partial<IUser>) {
  try {
    await connectMongoDB();
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    await connectMongoDB();
    return await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Health check
export async function checkDatabaseConnection() {
  try {
    const connection = await connectMongoDB();
    return connection.connection.readyState === 1; // 1 means connected
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}