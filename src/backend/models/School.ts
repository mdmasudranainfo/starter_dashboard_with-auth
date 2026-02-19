import { Schema, model, models } from 'mongoose';

// School interface
export interface ISchool {
  _id?: string;
  EIIN: string;
  name: string;
  logo?: string;
  email?: string;
  number?: string;
  address?: string;
  packageValidity: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// School schema
const schoolSchema = new Schema<ISchool>({
  EIIN: {
    type: String,
    required: [true, 'EIIN is required'],
    unique: true,
    trim: true,
    maxlength: [20, 'EIIN cannot exceed 20 characters'],
    match: [/^[0-9]+$/, 'EIIN must contain only numbers']
  },
  name: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [100, 'School name cannot exceed 100 characters']
  },
  logo: {
    type: String,
    default: null
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  number: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  packageValidity: {
    type: Date,
    required: [true, 'Package validity is required']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Prevent model recompilation in development
const School = models.School || model<ISchool>('School', schoolSchema);

export default School;