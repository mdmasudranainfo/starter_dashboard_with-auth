import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/src/backend/utility/db';
import { 
  createSchool, 
  findSchoolByEIIN, 
  findSchoolById, 
  getAllSchools, 
  updateSchool, 
  deleteSchool,
  schoolExistsByEIIN
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

// GET /api/schools - Get all schools
export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseConnection();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const eiin = searchParams.get('eiin');
    
    let schools;
    
    if (id) {
      // Get specific school by ID
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
    } else if (eiin) {
      // Get specific school by EIIN
      const school = await findSchoolByEIIN(eiin);
      if (!school) {
        return NextResponse.json(
          createErrorResponse('School not found'),
          { status: 404 }
        );
      }
      return NextResponse.json(
        createSuccessResponse(school)
      );
    } else {
      // Get all schools
      schools = await getAllSchools();
      return NextResponse.json(
        createSuccessResponse({ data: schools, count: schools.length })
      );
    }
  } catch (error: any) {
    console.error('API Error - GET /api/schools:', error);
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}

// POST /api/schools - Create a new school
export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseConnection();
    
    const body = await request.json();
    const { EIIN, name, logo, email, number, address, packageValidity } = body;

    // Validation
    if (!EIIN || !name || !packageValidity) {
      return NextResponse.json(
        createErrorResponse('EIIN, name, and packageValidity are required'),
        { status: 400 }
      );
    }

    // Check if school with this EIIN already exists
    const exists = await schoolExistsByEIIN(EIIN);
    if (exists) {
      return NextResponse.json(
        createErrorResponse('School with this EIIN already exists'),
        { status: 409 }
      );
    }

    // Create school
    const schoolData = {
      EIIN,
      name,
      logo: logo || null,
      email: email || undefined,
      number: number || undefined,
      address: address || undefined,
      packageValidity: new Date(packageValidity)
    };

    const school = await createSchool(schoolData);
    
    return NextResponse.json(
      createSuccessResponse(school, 'School created successfully'),
      { status: 201 }
    );

  } catch (error: any) {
    console.error('API Error - POST /api/schools:', error);
    
    // Handle duplicate EIIN error
    if (error.code === 11000) {
      return NextResponse.json(
        createErrorResponse('School with this EIIN already exists'),
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

// PUT /api/schools - This endpoint is not supported for direct use
export async function PUT(request: NextRequest) {
  try {
    return NextResponse.json(
      createErrorResponse('This endpoint does not support direct PUT requests. Use /api/schools/[id] instead.', 'NOT_SUPPORTED'),
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

// DELETE /api/schools - This endpoint is not supported for direct use
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json(
      createErrorResponse('This endpoint does not support direct DELETE requests. Use /api/schools/[id] instead.', 'NOT_SUPPORTED'),
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