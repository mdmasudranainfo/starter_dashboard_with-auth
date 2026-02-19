# School and User Models Implementation

## Overview
This document describes the implementation of School and User models with proper relationships, password hashing, and full CRUD operations.

## Database Models

### School Model
```typescript
interface ISchool {
  _id?: string;
  EIIN: string;        // Unique identifier for schools
  name: string;        // School name
  logo?: string;       // School logo URL
  email?: string;      // School email
  number?: string;     // School contact number
  address?: string;    // School address
  packageValidity: Date; // Subscription/package expiry date
  createdAt?: Date;
  updatedAt?: Date;
}
```

### User Model
```typescript
interface IUser {
  _id?: string;
  EIIN: string;        // Foreign key linking to School
  role: UserRole;      // Enum: 'Super Admin' | 'Admin' | 'Operator' | 'Teacher' | 'Parent'
  name: string;        // User's name
  email: string;       // Unique email address
  number?: string;     // User's contact number
  password: string;    // Hashed password
  photo?: string;      // User's photo URL
  isActive: boolean;   // Active/inactive status
  createdAt?: Date;
  updatedAt?: Date;
}

type UserRole = 'Super Admin' | 'Admin' | 'Operator' | 'Teacher' | 'Parent';
```

## Key Features

### 1. Password Security
- All passwords are automatically hashed using bcryptjs
- Salt rounds: 12 (secure)
- Password comparison method available on user instances

### 2. Data Relationships
- User model references School via EIIN field
- Proper indexing on EIIN for performance
- Validation ensures school exists before creating user

### 3. Validation
- Comprehensive validation for all fields
- Unique constraints on EIIN and email
- Format validation for emails and phone numbers

## API Endpoints

### Schools API
- `GET /api/schools` - Get all schools or specific school by ID/EIIN
- `POST /api/schools` - Create a new school
- `PUT /api/schools/[id]` - Update a school
- `DELETE /api/schools/[id]` - Delete a school

### Users API
- `GET /api/users` - Get all users or specific user by ID/email with filters
- `POST /api/users` - Create a new user
- `PUT /api/users/[id]` - Update a user
- `DELETE /api/users/[id]` - Delete a user (soft delete)

## Utility Functions

### School Utilities (`src/backend/utility/school.ts`)
- `createSchool()` - Create a new school
- `findSchoolByEIIN()` - Find school by EIIN
- `findSchoolById()` - Find school by ID
- `getAllSchools()` - Get all schools
- `updateSchool()` - Update a school
- `deleteSchool()` - Delete a school
- `schoolExistsByEIIN()` - Check if school exists

### User Utilities (`src/backend/utility/user.ts`)
- `createUser()` - Create a new user (with school validation)
- `findUserById()` - Find user by ID
- `findUserByEmail()` - Find user by email
- `findUsersByEIIN()` - Find all users for a school
- `findUsersByRole()` - Find users by role
- `getAllUsers()` - Get all users
- `updateUser()` - Update a user (with school validation)
- `deleteUser()` - Soft delete a user
- `permanentlyDeleteUser()` - Hard delete a user
- `authenticateUser()` - Authenticate user with email/password
- `changeUserPassword()` - Change user password
- `userExistsByEmail()` - Check if user exists

## Usage Examples

### Creating a School
```typescript
import { createSchool } from '@/src/backend/utility/school';

const newSchool = await createSchool({
  EIIN: '123456789',
  name: 'Example School',
  email: 'info@exampleschool.edu',
  number: '+1234567890',
  address: '123 School Street, City, Country',
  packageValidity: new Date('2025-12-31')
});
```

### Creating a User
```typescript
import { createUser } from '@/src/backend/utility/user';

const newUser = await createUser({
  EIIN: '123456789',  // Existing school EIIN
  role: 'Teacher',
  name: 'John Doe',
  email: 'john@example.com',
  number: '+1234567890',
  password: 'securePassword123',  // Will be automatically hashed
  photo: null
});
```

### Authenticating a User
```typescript
import { authenticateUser } from '@/src/backend/utility/user';

const user = await authenticateUser('john@example.com', 'securePassword123');
if (user) {
  console.log('Authentication successful');
  // Proceed with authenticated user session
} else {
  console.log('Authentication failed');
}
```

### Getting Users for a Specific School
```typescript
import { findUsersByEIIN } from '@/src/backend/utility/user';

const schoolUsers = await findUsersByEIIN('123456789');
console.log(`Found ${schoolUsers.length} users for this school`);
```

## Security Considerations

1. **Password Hashing**: All passwords are securely hashed using bcryptjs with 12 salt rounds
2. **Input Validation**: All inputs are validated before processing
3. **SQL Injection Prevention**: Using Mongoose ORM prevents injection attacks
4. **XSS Protection**: Passwords are not returned in API responses
5. **Access Control**: Future implementation should include role-based access controls

## Testing

Visit `/school-user-test` to:
- Create and view schools
- Create and view users
- Test all CRUD operations
- Verify password hashing is working

## Next Steps

1. Implement role-based access control
2. Add more comprehensive validation
3. Create additional models (Results, Exams, etc.)
4. Implement user session management
5. Add file upload functionality for photos and logos
6. Create dashboard views for different user roles

## Dependencies

- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `@types/bcryptjs`: TypeScript definitions for bcryptjs

## Error Handling

All API endpoints include comprehensive error handling:
- Validation errors with descriptive messages
- Duplicate entry detection
- Database connection errors
- Internal server errors

## Performance Optimization

- Indexes on frequently queried fields (EIIN, email)
- Efficient querying with population
- Connection pooling in database setup