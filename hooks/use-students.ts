import { useState, useEffect } from 'react';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { useToast } from '@/hooks/use-toast';

export type Student = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  gender?: string;
  age?: number;
  birth_date?: string;
  goal: string;
  status: 'active' | 'inactive' | 'onboarding' | 'paused';
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  workout_sessions?: Array<{
    id: string;
    completed_at?: string;
  }>;
  appointments?: Array<{
    id: string;
    start_time: string;
  }>;
};

export function useStudents() {
  const { supabase, user, isTrainer } = useSupabase();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      if (!isTrainer) throw new Error('Only trainers can access students');
      if (!user?.id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          workout_sessions!left (
            id,
            completed_at
          ),
          appointments!left (
            id,
            start_time
          )
        `)
        .eq('trainer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error loading students",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!isTrainer) throw new Error('Only trainers can create students');
      if (!user?.id) throw new Error('No authenticated user');

      const response = await fetch('/api/students/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-trainer-id': user.id
        },
        body: JSON.stringify(student)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create student');
      }

      const result = await response.json();
      await fetchStudents(); // Refresh the list
      return result.student;
    } catch (error: any) {
      console.error('Error creating student:', error);
      toast({
        title: "Error creating student",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      if (!isTrainer) throw new Error('Only trainers can update students');

      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating student",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      if (!isTrainer) throw new Error('Only trainers can delete students');

      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting student",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user && isTrainer) {
      fetchStudents();
    }
  }, [user, isTrainer]);

  return {
    students,
    loading,
    createStudent,
    updateStudent,
    deleteStudent,
    refreshStudents: fetchStudents
  };
}