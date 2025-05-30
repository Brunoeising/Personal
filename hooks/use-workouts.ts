import { useState, useEffect } from 'react';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { useToast } from '@/hooks/use-toast';

export type WorkoutTemplate = {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  difficulty: string;
  category: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  exercises?: WorkoutExercise[];
};

export type WorkoutExercise = {
  id: string;
  exercise_id: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  order_index: number;
  exercise?: {
    name: string;
    description: string;
    category: string;
    equipment: string;
    difficulty: string;
    muscle_group: string;
  };
};

export function useWorkouts() {
  const { supabase, user, isTrainer } = useSupabase();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('workout_templates')
        .select(`
          *,
          workout_exercises (
            *,
            exercise:exercises (
              name,
              description,
              category,
              equipment,
              difficulty,
              muscle_group
            )
          )
        `);

      // If user is a trainer, get their workouts plus public ones
      if (isTrainer) {
        query = query.or(`trainer_id.eq.${user?.id},is_public.eq.true`);
      } else {
        // If user is a student, only get public workouts and assigned ones
        query = query.eq('is_public', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar treinos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async (workout: Omit<WorkoutTemplate, 'id' | 'created_at' | 'updated_at'>, exercises: Omit<WorkoutExercise, 'id' | 'workout_template_id'>[]) => {
    try {
      if (!isTrainer) throw new Error('Apenas trainers podem criar treinos');

      // First create the workout template
      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_templates')
        .insert({
          ...workout,
          trainer_id: user?.id
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Then create the workout exercises
      const workoutExercises = exercises.map((exercise, index) => ({
        ...exercise,
        workout_template_id: workoutData.id,
        order_index: index + 1
      }));

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_exercises')
        .insert(workoutExercises)
        .select();

      if (exercisesError) throw exercisesError;

      const newWorkout = {
        ...workoutData,
        exercises: exercisesData
      };

      setWorkouts(prev => [newWorkout, ...prev]);
      return newWorkout;
    } catch (error: any) {
      toast({
        title: "Erro ao criar treino",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateWorkout = async (
    id: string, 
    updates: Partial<WorkoutTemplate>,
    exercises?: Omit<WorkoutExercise, 'id' | 'workout_template_id'>[]
  ) => {
    try {
      if (!isTrainer) throw new Error('Apenas trainers podem atualizar treinos');

      // Update workout template
      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (workoutError) throw workoutError;

      // If exercises were provided, update them
      if (exercises) {
        // Delete existing exercises
        await supabase
          .from('workout_exercises')
          .delete()
          .eq('workout_template_id', id);

        // Insert new exercises
        const workoutExercises = exercises.map((exercise, index) => ({
          ...exercise,
          workout_template_id: id,
          order_index: index + 1
        }));

        const { data: exercisesData, error: exercisesError } = await supabase
          .from('workout_exercises')
          .insert(workoutExercises)
          .select();

        if (exercisesError) throw exercisesError;

        workoutData.exercises = exercisesData;
      }

      setWorkouts(prev => prev.map(w => w.id === id ? workoutData : w));
      return workoutData;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar treino",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      if (!isTrainer) throw new Error('Apenas trainers podem deletar treinos');

      const { error } = await supabase
        .from('workout_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkouts(prev => prev.filter(w => w.id !== id));
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao deletar treino",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  return {
    workouts,
    loading,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    refreshWorkouts: fetchWorkouts
  };
}