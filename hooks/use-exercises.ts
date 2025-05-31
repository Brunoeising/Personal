import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { useToast } from '@/hooks/use-toast';

export type Exercise = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  category: string;
  equipment: string;
  difficulty: string;
  muscle_group: string;
  video_url?: string;
  image_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export function useExercises() {
  const { supabase, user, isTrainer } = useSupabase();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!user) {
        return;
      }

      let query = supabase.from('exercises').select('*');

      if (isTrainer) {
        query = query.or(`trainer_id.eq.${user.id},is_public.eq.true`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setExercises(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading exercises",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, isTrainer, supabase, toast]);

  const createExercise = async (exercise: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user) throw new Error('You must be logged in to create exercises');
      if (!isTrainer) throw new Error('Only trainers can create exercises');

      const { data, error } = await supabase
        .from('exercises')
        .insert({
          ...exercise,
          trainer_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setExercises(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating exercise",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    try {
      if (!user) throw new Error('You must be logged in to update exercises');
      if (!isTrainer) throw new Error('Only trainers can update exercises');

      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setExercises(prev => prev.map(ex => ex.id === id ? data : ex));
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating exercise",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteExercise = async (id: string) => {
    try {
      if (!user) throw new Error('You must be logged in to delete exercises');
      if (!isTrainer) throw new Error('Only trainers can delete exercises');

      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExercises(prev => prev.filter(ex => ex.id !== id));
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting exercise",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchExercises();
    }
  }, [user, fetchExercises]);

  return {
    exercises,
    loading,
    createExercise,
    updateExercise,
    deleteExercise,
    refreshExercises: fetchExercises
  };
}
