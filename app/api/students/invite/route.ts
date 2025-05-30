import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    console.log('Starting student invitation process...');

    // Get trainer ID from request header
    const trainerId = request.headers.get('x-trainer-id');
    console.log('Trainer ID from header:', trainerId);

    if (!trainerId) {
      console.error('Missing trainer ID in request headers');
      return NextResponse.json(
        { error: 'Trainer ID is required' },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.json();
    console.log('Request body:', body);

    const { name, email, phone, birthDate, gender, goal = "Objetivo não especificado", notes, isActive } = body;

    // Checagem de campos obrigatórios
    if (!name || !email) {
      console.error('Missing required fields: name or email');
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-12);
    console.log('Generated temporary password');

    // Create user with student role
    console.log('Creating auth user with email:', email);
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
      console.error('Auth error:', authError);
    }
    console.log('Auth user creation response:', { 
      userId: authData?.user?.id,
      error: authError?.message 
    });

    if (authError || !authData?.user?.id) {
      console.error('Failed to create auth user:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Verify we have a valid user ID
    const userId = authData.user.id;
    console.log('Generated user ID:', userId);

    if (!userId) {
      console.error('Invalid user ID generated');
      return NextResponse.json(
        { error: 'Invalid user ID generated' },
        { status: 500 }
      );
    }

    // Create student profile
    console.log('Creating student profile with data:', {
      id: userId,
      trainer_id: trainerId,
      full_name: name,
      email,
      goal
    });

    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert({
        id: userId,
        trainer_id: trainerId,
        full_name: name,
        email,
        phone: phone || null,
        gender: gender || null,
        birth_date: birthDate || null,
        goal: goal || "Objetivo não especificado",
        notes: notes || null,
        is_active: isActive ?? true,
        status: 'onboarding'
      })
      .select()
      .single();

    if (studentError) {
      console.error('Failed to create student profile:', studentError);
      // Rollback auth user creation if student profile creation fails
      console.log('Rolling back auth user creation...');
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: studentError.message || 'Erro ao criar perfil do aluno', details: studentError },
        { status: 500 }
      );
    }

    // Send password reset email
    console.log('Sending password reset email to:', email);
    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${request.nextUrl.origin}/auth/reset-password`,
      }
    });

    if (resetError) {
      console.error('Error sending reset password email:', resetError);
    } else {
      console.log('Password reset email sent successfully');
    }

    console.log('Student invitation completed successfully');
    return NextResponse.json({ 
      message: 'Student invited successfully',
      student: studentData
    });

  } catch (error: any) {
    console.error('Error in student invitation process:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to invite student', details: error },
      { status: 500 }
    );
  }
}