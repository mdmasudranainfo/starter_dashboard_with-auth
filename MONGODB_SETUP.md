# MongoDB Setup Guide

## Overview
This project uses MongoDB with Mongoose ODM for database operations. The connection is properly configured with connection pooling and error handling.

## Prerequisites
1. MongoDB installed locally or MongoDB Atlas account
2. Node.js and npm installed

## Setup Instructions

### 1. Install MongoDB (if not already installed)
- **Local Installation**: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **Cloud (MongoDB Atlas)**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)

### 2. Environment Configuration
Update your `.env.local` file with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/eresult_db
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eresult_db
```

### 3. Start MongoDB (for local installation)
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

## Project Structure
```
src/backend/
├── lib/mongodb.ts          # Database connection logic
├── models/User.ts          # User model example
└── utility/db.ts           # Database utility functions

app/
├── api/users/route.ts      # API route example
└── database-test/page.tsx  # Test page
```

## Key Features

### Connection Management
- **Connection Pooling**: Reuses connections for better performance
- **Development Safety**: Prevents multiple connections in development
- **Error Handling**: Comprehensive error logging and handling
- **Graceful Shutdown**: Proper cleanup on application termination

### Usage Examples

#### 1. Connect to Database
```typescript
import { connectMongoDB } from '@/src/backend/lib/mongodb';

await connectMongoDB();
```

#### 2. Using Models
```typescript
import User from '@/src/backend/models/User';

// Create user
const user = new User({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});
await user.save();

// Find users
const users = await User.find({ isActive: true });
```

#### 3. Using Utility Functions
```typescript
import { createUser, getAllUsers } from '@/src/backend/utility/db';

// Create user
const newUser = await createUser({
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'password123'
});

// Get all users
const users = await getAllUsers();
```

#### 4. API Routes
```typescript
// GET /api/users - Get all users
// POST /api/users - Create new user
```

## Testing the Connection

Visit `/database-test` in your browser to:
- Check connection status
- Create test users
- View existing users

## Best Practices

### 1. Password Security
⚠️ **Important**: In production, always hash passwords before storing:
```typescript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 12);
```

### 2. Environment Variables
Never commit `.env.local` to version control. Add it to `.gitignore`.

### 3. Connection Management
The connection is automatically managed and reused. You don't need to manually connect/disconnect in most cases.

### 4. Error Handling
Always wrap database operations in try-catch blocks:
```typescript
try {
  const user = await User.findById(id);
} catch (error) {
  console.error('Database error:', error);
  // Handle error appropriately
}
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MongoDB is running
   - Verify the connection string in `.env.local`
   - Ensure MongoDB is listening on the correct port

2. **Authentication Failed**
   - Check username/password for MongoDB Atlas
   - Verify IP whitelist settings in MongoDB Atlas

3. **Model Compilation Error**
   - This happens in development when models are recompiled
   - The code includes protection against this

### Debugging
Enable mongoose debug mode:
```typescript
mongoose.set('debug', true);
```

## Next Steps
1. Add more models as needed (e.g., Results, Exams, etc.)
2. Implement proper authentication middleware
3. Add data validation and sanitization
4. Set up database indexes for better performance
5. Implement proper error logging and monitoring

## Resources
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)