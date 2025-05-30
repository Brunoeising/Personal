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
  progress?: number;
  total_sessions?: number;
  next_session?: string;
  last_session?: string;
  workout_sessions?: Array<{
    completed_at: string;
  }>;
  appointments?: Array<{
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
      
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          workout_sessions (
            completed_at
          ),
          appointments (
            start_time
          )
        `)
        .eq('trainer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data
      const processedStudents = data?.map(student => {
        // Calculate total sessions
        const totalSessions = student.workout_sessions?.length || 0;

        // Find the latest completed session
        const lastSession = student.workout_sessions
          ?.map(session => session.completed_at)
          .filter(Boolean)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

        // Find the next upcoming appointment
        const nextSession = student.appointments
          ?.map(appointment => appointment.start_time)
          .filter(date => new Date(date) > new Date())
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

        return {
          ...student,
          total_sessions: totalSessions,
          last_session: lastSession,
          next_session: nextSession,
          progress: Math.floor(Math.random() * 100) // Temporary - implement real logic
        };
      }) || [];

      setStudents(processedStudents);
    } catch (error: any) {
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

      const response = await fetch('/api/students/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-trainer-id': user?.id || ''
        },
        body: JSON.stringify(student)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error creating student');
      }

      await fetchStudents(); // Refresh the students list
      return result.student;
    } catch (error: any) {
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
