"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type UserRole = 'trainer' | 'student';

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  subscription_tier?: string;
  subscription_status?: string;
  trainer_id?: string; // For students
};

type SupabaseContext = {
  supabase: SupabaseClient;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isTrainer: boolean;
  isStudent: boolean;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select(`
              *,
              trainers (subscription_tier, subscription_status),
              students!students_id_fkey (trainer_id)
            `)
            .eq('id', session.user.id)
            .single();

          if (!profileError && profileData) {
            setProfile({
              id: profileData.id,
              full_name: profileData.full_name,
              email: profileData.email,
              role: session.user.user_metadata.role || 'trainer',
              subscription_tier: profileData.trainers?.subscription_tier,
              subscription_status: profileData.trainers?.subscription_status,
              trainer_id: profileData.students?.trainer_id
            });
          }
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          // Fetch profile data when auth state changes
          const { data: profileData } = await supabase
            .from('profiles')
            .select(`
              *,
              trainers (subscription_tier, subscription_status),
              students!students_id_fkey (trainer_id)
            `)
            .eq('id', session.user.id)
            .single();

          if (profileData) {
            setProfile({
              id: profileData.id,
              full_name: profileData.full_name,
              email: profileData.email,
              role: session.user.user_metadata.role || 'trainer',
              subscription_tier: profileData.trainers?.subscription_tier,
              subscription_status: profileData.trainers?.subscription_status,
              trainer_id: profileData.students?.trainer_id
            });
          }
        } else {
          setProfile(null);
        }
        router.refresh();
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  const value = {
    supabase,
    user,
    profile,
    loading,
    isTrainer: profile?.role === 'trainer',
    isStudent: profile?.role === 'student'
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  
  return context;
};