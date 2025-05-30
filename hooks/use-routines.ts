import { useState, useEffect } from 'react';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { useToast } from '@/hooks/use-toast';
import { WorkoutTemplate } from './use-workouts';

export type Routine = {
  id: string;
  student_id: string;
  workout_template_id: string;
  assigned_date: string;
  due_date?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  student?: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  workout_template?: WorkoutTemplate;
};

export function useRoutines() {
  const { supabase, user, isTrainer } = useSupabase();
  const { toast } = useToast();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('student_workouts')
        .select(`
          *,
          student:students (
            full_name,
            email,
            avatar_url
          ),
          workout_template:workout_templates (
            *,
            workout_exercises (
              *,
              exercise:exercises (*)
            )
          )
        `);

      if (isTrainer) {
        query = query.eq('trainer_id', user?.id);
      } else {
        query = query.eq('student_id', user?.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setRoutines(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading routines",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRoutine = async (routine: Omit<Routine, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!isTrainer) throw new Error('Only trainers can create routines');

      const { data, error } = await supabase
        .from('student_workouts')
        .insert(routine)
        .select(`
          *,
          student:students (
            full_name,
            email,
            avatar_url
          ),
          workout_template:workout_templates (
            *,
            workout_exercises (
              *,
              exercise:exercises (*)
            )
          )
        `)
        .single();

      if (error) throw error;

      setRoutines(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating routine",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateRoutine = async (id: string, updates: Partial<Routine>) => {
    try {
      if (!isTrainer) throw new Error('Only trainers can update routines');

      const { data, error } = await supabase
        .from('student_workouts')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          student:students (
            full_name,
            email,
            avatar_url
          ),
          workout_template:workout_templates (
            *,
            workout_exercises (
              *,
              exercise:exercises (*)
            )
          )
        `)
        .single();

      if (error) throw error;

      setRoutines(prev => prev.map(r => r.id === id ? data : r));
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating routine",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      if (!isTrainer) throw new Error('Only trainers can delete routines');

      const { error } = await supabase
        .from('student_workouts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRoutines(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting routine",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoutines();
    }
  }, [user]);

  return {
    routines,
    loading,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    refreshRoutines: fetchRoutines
  };
}