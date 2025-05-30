import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    // Get trainer ID from request header
    const trainerId = request.headers.get('x-trainer-id');
    if (!trainerId) {
      return NextResponse.json(
        { error: 'Trainer ID is required' },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.json();
    const { name, email, phone, birthDate, gender, goal, notes, isActive } = body;

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-12);

    // Create user with student role
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        role: 'student'
      }
    });

    if (authError) {
      throw authError;
    }

    // Create student profile
    const { error: studentError } = await supabase
      .from('students')
      .insert({
        id: authData.user.id,
        trainer_id: trainerId,
        full_name: name,
        email,
        phone,
        gender,
        birth_date: birthDate,
        goal,
        notes,
        is_active: isActive,
        status: 'onboarding'
      });

    if (studentError) {
      // Rollback auth user creation if student profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw studentError;
    }

    // Send password reset email
    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${request.nextUrl.origin}/auth/reset-password`,
      }
    });

    if (resetError) {
      console.error('Error sending reset password email:', resetError);
    }

    return NextResponse.json({ 
      message: 'Student invited successfully',
      student: {
        id: authData.user.id,
        email,
        name
      }
    });

  } catch (error: any) {
    console.error('Error inviting student:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to invite student' },
      { status: 500 }
    );
  }
}
