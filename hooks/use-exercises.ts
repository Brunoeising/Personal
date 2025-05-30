import { useState, useEffect } from 'react';
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

  const fetchExercises = async () => {
    try {
      console.log('Fetching exercises, user:', user?.id, 'isTrainer:', isTrainer);
      setLoading(true);
      
      if (!user) {
        console.log('No user, skipping fetch');
        return;
      }

      let query = supabase.from('exercises').select('*');

      if (isTrainer) {
        console.log('Fetching trainer exercises');
        query = query.or(`trainer_id.eq.${user.id},is_public.eq.true`);
      } else {
        console.log('Fetching public exercises only');
        query = query.eq('is_public', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      console.log('Exercises fetched:', data?.length);
      setExercises(data || []);
    } catch (error: any) {
      console.error('Exercise fetch error:', error);
      toast({
        title: "Error loading exercises",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createExercise = async (exercise: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!isTrainer) throw new Error('Apenas trainers podem criar exercícios');

      const { data, error } = await supabase
        .from('exercises')
        .insert({
          ...exercise,
          trainer_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setExercises(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar exercício",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    try {
      if (!isTrainer) throw new Error('Apenas trainers podem atualizar exercícios');

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
        title: "Erro ao atualizar exercício",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteExercise = async (id: string) => {
    try {
      if (!isTrainer) throw new Error('Apenas trainers podem deletar exercícios');

      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExercises(prev => prev.filter(ex => ex.id !== id));
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao deletar exercício",
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
  }, [user, isTrainer]);

  return {
    exercises,
    loading,
    createExercise,
    updateExercise,
    deleteExercise,
    refreshExercises: fetchExercises
  };
}