import { connectMongoDB } from '../lib/mongodb';
import User, { IUser, IUserCreation, IUserDocument, UserRole } from '../models/User';
import School from '../models/School';
import { Types } from 'mongoose';

/**
 * User database utility functions
 */

// Create a new user
export async function createUser(userData: IUserCreation) {
  try {
    await connectMongoDB();
    
    // Verify that the school exists
    const schoolExists = await School.exists({ EIIN: userData.EIIN });
    if (!schoolExists) {
      throw new Error(`School with EIIN ${userData.EIIN} does not exist`);
    }
    
    const user = new User(userData);
    await user.save();
    // Populate the school information in the returned user
    await user.populate('EIIN', 'name email number address');
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Find user by ID
export async function findUserById(id: string) {
  try {
    await connectMongoDB();
    return await User.findById(id).populate('EIIN', 'name email number address');
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

// Find user by email
export async function findUserByEmail(email: string) {
  try {
    await connectMongoDB();
    return await User.findOne({ email }).populate('EIIN', 'name email number address');
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

// Find users by EIIN (all users belonging to a school)
export async function findUsersByEIIN(eiin: string) {
  try {
    await connectMongoDB();
    return await User.find({ EIIN: eiin }).populate('EIIN', 'name email number address');
  } catch (error) {
    console.error('Error finding users by EIIN:', error);
    throw error;
  }
}

// Find users by role
export async function findUsersByRole(role: UserRole) {
  try {
    await connectMongoDB();
    return await User.find({ role }).populate('EIIN', 'name email number address');
  } catch (error) {
    console.error('Error finding users by role:', error);
    throw error;
  }
}

// Get all users
export async function getAllUsers() {
  try {
    await connectMongoDB();
    return await User.find({}).populate('EIIN', 'name email number address');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Update user
export async function updateUser(id: string, updateData: Partial<IUser>) {
  try {
    await connectMongoDB();
    
    // If updating EIIN, verify that the school exists
    if (updateData.EIIN) {
      const schoolExists = await School.exists({ EIIN: updateData.EIIN });
      if (!schoolExists) {
        throw new Error(`School with EIIN ${updateData.EIIN} does not exist`);
      }
    }
    
    return await User.findByIdAndUpdate(id, updateData, { new: true })
      .populate('EIIN', 'name email number address');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Change user password
export async function changeUserPassword(id: string, newPassword: string) {
  try {
    await connectMongoDB();
    
    // Create a temporary user instance to hash the password
    const tempUser = new User({ password: newPassword } as IUser);
    await tempUser.save(); // This will trigger the pre-save hook to hash the password
    
    // Update the user with the hashed password
    return await User.findByIdAndUpdate(
      id, 
      { password: tempUser.password }, 
      { new: true }
    ).populate('EIIN', 'name email number address');
  } catch (error) {
    console.error('Error changing user password:', error);
    throw error;
  }
}

// Delete user
export async function deleteUser(id: string) {
  try {
    await connectMongoDB();
    return await User.findByIdAndUpdate(id, { isActive: false }, { new: true })
      .populate('EIIN', 'name email number address');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Permanently delete user (hard delete)
export async function permanentlyDeleteUser(id: string) {
  try {
    await connectMongoDB();
    return await User.findByIdAndDelete(id);
  } catch (error) {
    console.error('Error permanently deleting user:', error);
    throw error;
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string) {
  try {
    await connectMongoDB();
    const user = await User.findOne({ email, isActive: true })
      .populate('EIIN', 'name email number address');
    
    if (!user) {
      return null; // User not found or inactive
    }
    
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return null; // Invalid password
    }
    
    return user;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

// Check if user exists by email
export async function userExistsByEmail(email: string) {
  try {
    await connectMongoDB();
    const user = await User.findOne({ email });
    return !!user;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
}