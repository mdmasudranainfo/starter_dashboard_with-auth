import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define possible user roles
export type UserRole = 'Super Admin' | 'Admin' | 'Operator' | 'Teacher' | 'Parent';

// User interface
export interface IUser {
  EIIN: string;
  role: UserRole;
  name: string;
  email: string;
  number?: string;
  password: string;
  photo?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// User creation interface (EIIN required for creation)
export interface IUserCreation {
  EIIN: string;
  role: UserRole;
  name: string;
  email: string;
  number?: string;
  password: string;
  photo?: string;
  isActive?: boolean;
}

// User document interface extending IUser and Document
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema
const userSchema = new Schema<IUser, IUserDocument>({
  EIIN: {
    type: String,
    required: [true, 'EIIN is required'],
    ref: 'School', // Reference to School model
    index: true // Add index for better query performance
  },
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Operator', 'Teacher', 'Parent'],
    required: [true, 'Role is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  number: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  photo: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function () {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }
  
  try {
    // Hash password with salt
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  } catch (error) {
    throw error;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Prevent model recompilation in development
const User = models.User || model<IUser>('User', userSchema);

export default User;