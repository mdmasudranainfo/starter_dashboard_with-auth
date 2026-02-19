import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/src/backend/utility/db';
import { 
  findSchoolById,
  updateSchool, 
  deleteSchool
} from '@/src/backend/utility/school';
import { createSuccessResponse, createErrorResponse } from '@/src/backend/utility/ApiResponse';

// Initialize database connection
let isDatabaseInitialized = false;

async function ensureDatabaseConnection() {
  if (!isDatabaseInitialized) {
    await initializeDatabase();
    isDatabaseInitialized = true;
  }
}

// GET /api/schools/[id] - Get a specific school by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseConnection();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        createErrorResponse('School ID is required'),
        { status: 400 }
      );
    }

    const school = await findSchoolById(id);
    if (!school) {
      return NextResponse.json(
        createErrorResponse('School not found'),
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      createSuccessResponse(school)
    );
  } catch (error: any) {
    console.error('API Error - GET /api/schools/[id]:', error);
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}

// PUT /api/schools/[id] - Update a school
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseConnection();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        createErrorResponse('School ID is required'),
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, logo, email, number, address, packageValidity } = body;

    // Validation - at least one field must be provided
    if (!name && logo === undefined && email === undefined && number === undefined && address === undefined && !packageValidity) {
      return NextResponse.json(
        createErrorResponse('At least one field to update is required'),
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (logo !== undefined) updateData.logo = logo;
    if (email !== undefined) updateData.email = email;
    if (number !== undefined) updateData.number = number;
    if (address !== undefined) updateData.address = address;
    if (packageValidity) updateData.packageValidity = new Date(packageValidity);

    // Update school
    const updatedSchool = await updateSchool(id, updateData);
    
    if (!updatedSchool) {
      return NextResponse.json(
        createErrorResponse('School not found'),
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      createSuccessResponse(updatedSchool, 'School updated successfully')
    );

  } catch (error: any) {
    console.error('API Error - PUT /api/schools/[id]:', error);
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[id] - Delete a school
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseConnection();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        createErrorResponse('School ID is required'),
        { status: 400 }
      );
    }

    // Delete school
    const deletedSchool = await deleteSchool(id);
    
    if (!deletedSchool) {
      return NextResponse.json(
        createErrorResponse('School not found'),
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      createSuccessResponse(deletedSchool, 'School deleted successfully')
    );

  } catch (error: any) {
    console.error('API Error - DELETE /api/schools/[id]:', error);
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}