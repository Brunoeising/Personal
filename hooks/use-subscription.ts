import { useSupabase } from "@/lib/providers/supabase-provider";

type SubscriptionLimits = {
  maxStudents: number;
  maxTrainers: number;
  features: string[];
};

const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    maxStudents: 1,
    maxTrainers: 1,
    features: ['basic_workouts', 'basic_exercises']
  },
  pro: {
    maxStudents: 100,
    maxTrainers: 1,
    features: ['advanced_workouts', 'advanced_exercises', 'analytics', 'chat']
  },
  enterprise: {
    maxStudents: 1000,
    maxTrainers: 5,
    features: ['all_features', 'white_label', 'api_access']
  }
};

export function useSubscription() {
  const { profile } = useSupabase();
  const tier = profile?.subscription_tier || 'free';
  const limits = SUBSCRIPTION_LIMITS[tier];

  const canAddStudent = async () => {
    if (!profile) return false;

    const { data: studentsCount } = await supabase
      .from('students')
      .select('id', { count: 'exact' })
      .eq('trainer_id', profile.id);

    return (studentsCount?.length || 0) < limits.maxStudents;
  };

  const canAddTrainer = async () => {
    if (!profile || tier !== 'enterprise') return false;

    const { data: trainersCount } = await supabase
      .from('trainers')
      .select('id', { count: 'exact' })
      .eq('parent_trainer_id', profile.id);

    return (trainersCount?.length || 0) < limits.maxTrainers;
  };

  const hasFeature = (feature: string) => {
    return limits.features.includes(feature) || limits.features.includes('all_features');
  };

  return {
    tier,
    limits,
    canAddStudent,
    canAddTrainer,
    hasFeature,
    isActive: profile?.subscription_status === 'active'
  };
}