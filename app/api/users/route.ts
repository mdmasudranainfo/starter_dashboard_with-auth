import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/src/backend/utility/db';
import { 
  createUser,
  findUserById,
  findUserByEmail,
  findUsersByEIIN,
  findUsersByRole,
  getAllUsers,
  updateUser,
  deleteUser,
  authenticateUser,
  userExistsByEmail
} from '@/src/backend/utility/user';
import { UserRole } from '@/src/backend/models/User';
import { createSuccessResponse, createErrorResponse } from '@/src/backend/utility/ApiResponse';

// Initialize database connection
let isDatabaseInitialized = false;

async function ensureDatabaseConnection() {
  if (!isDatabaseInitialized) {
    await initializeDatabase();
    isDatabaseInitialized = true;
  }
}

// GET /api/users - Get users with optional filters
export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseConnection();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const eiin = searchParams.get('eiin');
    const role = searchParams.get('role') as UserRole;
    
    // Validate role if provided
    const validRoles: UserRole[] = ['Super Admin', 'Admin', 'Operator', 'Teacher', 'Parent'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        createErrorResponse('Invalid role provided'),
        { status: 400 }
      );
    }
    
    let users;
    let user;
    
    if (id) {
      // Get specific user by ID
      user = await findUserById(id);
      if (!user) {
        return NextResponse.json(
          createErrorResponse('User not found'),
          { status: 404 }
        );
      }
      return NextResponse.json(
        createSuccessResponse(user)
      );
    } else if (email) {
      // Get specific user by email
      user = await findUserByEmail(email);
      if (!user) {
        return NextResponse.json(
          createErrorResponse('User not found'),
          { status: 404 }
        );
      }
      return NextResponse.json(
        createSuccessResponse(user)
      );
    } else if (eiin) {
      // Get users by EIIN (school)
      users = await findUsersByEIIN(eiin);
      return NextResponse.json(
        createSuccessResponse({ data: users, count: users.length })
      );
    } else if (role) {
      // Get users by role
      users = await findUsersByRole(role);
      return NextResponse.json(
        createSuccessResponse({ data: users, count: users.length })
      );
    } else {
      // Get all users
      users = await getAllUsers();
      return NextResponse.json(
        createSuccessResponse({ data: users, count: users.length })
      );
    }
  } catch (error: any) {
    console.error('API Error - GET /api/users:', error);
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseConnection();
    
    const body = await request.json();
    const { EIIN, role, name, email, number, password, photo } = body;

    // Validation
    if (!EIIN || !role || !name || !email || !password) {
      return NextResponse.json(
        createErrorResponse('EIIN, role, name, email, and password are required'),
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ['Super Admin', 'Admin', 'Operator', 'Teacher', 'Parent'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        createErrorResponse('Invalid role provided'),
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const exists = await userExistsByEmail(email);
    if (exists) {
      return NextResponse.json(
        createErrorResponse('User with this email already exists'),
        { status: 409 }
      );
    }

    // Create user
    const userData = {
      EIIN,
      role,
      name,
      email,
      number: number || undefined,
      password, // Password will be hashed automatically
      photo: photo || null,
      isActive: true
    };

    const user = await createUser(userData);
    
    // Return user without password
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    
    return NextResponse.json(
      createSuccessResponse(userWithoutPassword, 'User created successfully'),
      { status: 201 }
    );

  } catch (error: any) {
    console.error('API Error - POST /api/users:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        createErrorResponse('User with this email already exists'),
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}

// PUT /api/users - This endpoint is not supported for direct use
export async function PUT(request: NextRequest) {
  try {
    return NextResponse.json(
      createErrorResponse('This endpoint does not support direct PUT requests. Use /api/users/[id] instead.', 'NOT_SUPPORTED'),
      { status: 405 }
    );
  } catch (error: any) {
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}

// DELETE /api/users - This endpoint is not supported for direct use
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json(
      createErrorResponse('This endpoint does not support direct DELETE requests. Use /api/users/[id] instead.', 'NOT_SUPPORTED'),
      { status: 405 }
    );
  } catch (error: any) {
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}