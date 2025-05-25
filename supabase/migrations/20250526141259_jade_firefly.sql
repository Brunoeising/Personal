/*
  # Initial Schema for FitPro Platform

  1. New Tables
     - `profiles` - Core user profiles
     - `trainers` - Personal trainer profiles
     - `students` - Student profiles
     - `subscriptions` - Subscription plans and payment info
     - `exercises` - Exercise library
     - `workout_templates` - Workout templates
     - `workout_exercises` - Junction table for workout templates and exercises
     - `student_workouts` - Assigned workouts to students
     - `workout_sessions` - Completed workout sessions
     - `session_exercises` - Exercises completed in a session

  2. Security
     - Enable RLS on all tables
     - Add policies for trainers to access their own data
     - Add policies for students to access their own data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  specialization TEXT,
  experience TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  gender TEXT,
  age INTEGER,
  goal TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  tier TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  category TEXT,
  equipment TEXT,
  difficulty TEXT,
  muscle_group TEXT,
  video_url TEXT,
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create workout_templates table
CREATE TABLE IF NOT EXISTS workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  difficulty TEXT,
  category TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create workout_exercises table (junction table)
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  rest_seconds INTEGER,
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(workout_template_id, exercise_id, order_index)
);

-- Create student_workouts table (assigned workouts)
CREATE TABLE IF NOT EXISTS student_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  workout_template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  assigned_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'assigned',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create workout_sessions table (completed workouts)
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_workout_id UUID REFERENCES student_workouts(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  feedback TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create session_exercises table
CREATE TABLE IF NOT EXISTS session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets_completed INTEGER NOT NULL,
  reps_completed TEXT NOT NULL,
  weight TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled',
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles table policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Trainers table policies
CREATE POLICY "Trainers can view their own profile"
  ON trainers
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Trainers can update their own profile"
  ON trainers
  FOR UPDATE
  USING (auth.uid() = id);

-- Students table policies
CREATE POLICY "Trainers can view their own students"
  ON students
  FOR SELECT
  USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can insert their own students"
  ON students
  FOR INSERT
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can update their own students"
  ON students
  FOR UPDATE
  USING (auth.uid() = trainer_id);

-- Subscriptions table policies
CREATE POLICY "Trainers can view their own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = trainer_id);

-- Exercises table policies
CREATE POLICY "Anyone can view public exercises"
  ON exercises
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Trainers can view their own exercises"
  ON exercises
  FOR SELECT
  USING (auth.uid() = trainer_id OR is_public = true);

CREATE POLICY "Trainers can insert their own exercises"
  ON exercises
  FOR INSERT
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can update their own exercises"
  ON exercises
  FOR UPDATE
  USING (auth.uid() = trainer_id);

-- Workout templates table policies
CREATE POLICY "Anyone can view public workout templates"
  ON workout_templates
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Trainers can view their own workout templates"
  ON workout_templates
  FOR SELECT
  USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can insert their own workout templates"
  ON workout_templates
  FOR INSERT
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can update their own workout templates"
  ON workout_templates
  FOR UPDATE
  USING (auth.uid() = trainer_id);

-- Workout exercises table policies
CREATE POLICY "Anyone can view workout exercises for public templates"
  ON workout_exercises
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_templates wt
      WHERE wt.id = workout_exercises.workout_template_id
      AND (wt.is_public = true OR wt.trainer_id = auth.uid())
    )
  );

CREATE POLICY "Trainers can insert workout exercises"
  ON workout_exercises
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_templates wt
      WHERE wt.id = workout_exercises.workout_template_id
      AND wt.trainer_id = auth.uid()
    )
  );

-- Student workouts table policies
CREATE POLICY "Trainers can view workouts assigned to their students"
  ON student_workouts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_workouts.student_id
      AND s.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own workouts"
  ON student_workouts
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students WHERE trainer_id = auth.uid()
    )
  );

-- Messages table policies
CREATE POLICY "Users can view messages they sent or received"
  ON messages
  FOR SELECT
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can insert messages they send"
  ON messages
  FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Appointments table policies
CREATE POLICY "Trainers can view appointments with their students"
  ON appointments
  FOR SELECT
  USING (trainer_id = auth.uid());

CREATE POLICY "Trainers can insert appointments with their students"
  ON appointments
  FOR INSERT
  WITH CHECK (trainer_id = auth.uid());

-- Add some default exercises
INSERT INTO exercises (id, name, description, instructions, category, equipment, difficulty, muscle_group, is_public)
VALUES
  (gen_random_uuid(), 'Bench Press', 'Classic chest exercise', 'Lie on bench, lower bar to chest, press up', 'Strength', 'Barbell', 'Intermediate', 'Chest', true),
  (gen_random_uuid(), 'Squat', 'Fundamental leg exercise', 'Stand with feet shoulder width apart, bend knees, lower hips', 'Strength', 'Barbell', 'Intermediate', 'Legs', true),
  (gen_random_uuid(), 'Deadlift', 'Full body pulling exercise', 'Bend at hips and knees, grab bar, stand up', 'Strength', 'Barbell', 'Advanced', 'Back', true),
  (gen_random_uuid(), 'Pull-up', 'Upper body pulling exercise', 'Hang from bar, pull body up until chin clears bar', 'Bodyweight', 'Pull-up Bar', 'Intermediate', 'Back', true),
  (gen_random_uuid(), 'Push-up', 'Upper body pushing exercise', 'Start in plank position, lower chest to floor, push back up', 'Bodyweight', 'None', 'Beginner', 'Chest', true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  
  -- If the user is a trainer (default role), insert into trainers table
  IF new.raw_user_meta_data->>'role' = 'trainer' THEN
    INSERT INTO trainers (id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();