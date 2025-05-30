import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    // Create Supabase client with service role inside the function
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false }
      }
    );

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
    const { name, email, phone, birthDate, gender, goal = "Objetivo não especificado", notes, isActive } = body;

    // Check required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

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

    if (authError || !authData?.user?.id) {
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user account' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // Create student profile
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
      // Rollback auth user creation if student profile creation fails
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: studentError.message || 'Erro ao criar perfil do aluno' },
        { status: 500 }
      );
    }

    // Send password reset email
    await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${request.nextUrl.origin}/auth/reset-password`,
      }
    });

    return NextResponse.json({ 
      message: 'Student invited successfully',
      student: studentData
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to invite student' },
      { status: 500 }
    );
  }
}
