import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false }
      }
    );

    // Get trainer ID from header
    const trainerId = request.headers.get('x-trainer-id');
    if (!trainerId) {
      return NextResponse.json({ error: 'Trainer ID is required' }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    const { 
      full_name, 
      email, 
      phone, 
      birth_date, 
      age,
      gender, 
      goal, 
      notes, 
      is_active 
    } = body;

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-12),
      email_confirm: true,
      user_metadata: {
        full_name,
        role: 'student'
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Create student profile
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert({
        id: authData.user.id,
        trainer_id: trainerId,
        full_name,
        email,
        phone,
        birth_date,
        age,
        gender,
        goal: goal || "Objetivo não especificado",
        notes,
        is_active: is_active ?? true,
        status: 'onboarding'
      })
      .select()
      .single();

    if (studentError) {
      console.error('Student creation error:', studentError);
      // Rollback auth user if student creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ 
        error: `Erro ao criar perfil do aluno: ${studentError.message}` 
      }, { status: 500 });
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
      console.error('Reset email error:', resetError);
      return NextResponse.json({ 
        message: 'Aluno criado com sucesso, mas houve um erro ao enviar o email de acesso',
        error: resetError.message,
        student: studentData
      }, { status: 201 });
    }

    return NextResponse.json({ 
      message: 'Aluno criado com sucesso e email de acesso enviado',
      student: studentData
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: `Erro inesperado: ${error.message}` 
    }, { status: 500 });
  }
}