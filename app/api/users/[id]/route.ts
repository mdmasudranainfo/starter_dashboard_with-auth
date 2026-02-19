import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/src/backend/utility/db';
import { 
  findUserById,
  updateUser,
  deleteUser
} from '@/src/backend/utility/user';
import { createSuccessResponse, createErrorResponse } from '@/src/backend/utility/ApiResponse';

// Initialize database connection
let isDatabaseInitialized = false;

async function ensureDatabaseConnection() {
  if (!isDatabaseInitialized) {
    await initializeDatabase();
    isDatabaseInitialized = true;
  }
}

// GET /api/users/[id] - Get a specific user by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseConnection();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        createErrorResponse('User ID is required'),
        { status: 400 }
      );
    }

    const user = await findUserById(id);
    if (!user) {
      return NextResponse.json(
        createErrorResponse('User not found'),
        { status: 404 }
      );
    }
    
    // Return user without password
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    
    return NextResponse.json(
      createSuccessResponse(userWithoutPassword)
    );
  } catch (error: any) {
    console.error('API Error - GET /api/users/[id]:', error);
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseConnection();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        createErrorResponse('User ID is required'),
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role, name, email, number, photo } = body;

    // Validation - at least one field must be provided
    if (!role && !name && !email && !number && photo === undefined) {
      return NextResponse.json(
        createErrorResponse('At least one field to update is required'),
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (role) updateData.role = role;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (number !== undefined) updateData.number = number;
    if (photo !== undefined) updateData.photo = photo;

    // Update user
    const updatedUser = await updateUser(id, updateData);
    
    if (!updatedUser) {
      return NextResponse.json(
        createErrorResponse('User not found'),
        { status: 404 }
      );
    }
    
    // Return user without password
    const userObject = updatedUser.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    
    return NextResponse.json(
      createSuccessResponse(userWithoutPassword, 'User updated successfully')
    );

  } catch (error: any) {
    console.error('API Error - PUT /api/users/[id]:', error);
    
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

// DELETE /api/users/[id] - Delete a user (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseConnection();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        createErrorResponse('User ID is required'),
        { status: 400 }
      );
    }

    // Delete user (soft delete - set isActive to false)
    const deletedUser = await deleteUser(id);
    
    if (!deletedUser) {
      return NextResponse.json(
        createErrorResponse('User not found'),
        { status: 404 }
      );
    }
    
    // Return user without password
    const userObject = deletedUser.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    
    return NextResponse.json(
      createSuccessResponse(userWithoutPassword, 'User deleted successfully')
    );

  } catch (error: any) {
    console.error('API Error - DELETE /api/users/[id]:', error);
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}