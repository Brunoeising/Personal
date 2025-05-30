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

  const createProfile = async (userId: string, email: string, role: UserRole) => {
    try {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: email,
            full_name: email.split('@')[0], // Temporary name from email
            role: role
          }
        ])
        .select(`
          *,
          trainers (subscription_tier, subscription_status),
          students!students_id_fkey (trainer_id)
        `)
        .maybeSingle();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return null;
      }

      if (newProfile) {
        return {
          id: newProfile.id,
          full_name: newProfile.full_name,
          email: newProfile.email,
          role: newProfile.role as UserRole,
          subscription_tier: newProfile.trainers?.subscription_tier,
          subscription_status: newProfile.trainers?.subscription_status,
          trainer_id: newProfile.students?.trainer_id
        };
      }
      return null;
    } catch (error) {
      console.error('Error in createProfile:', error);
      return null;
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          trainers (subscription_tier, subscription_status),
          students!students_id_fkey (trainer_id)
        `)
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      if (profileData) {
        return {
          id: profileData.id,
          full_name: profileData.full_name,
          email: profileData.email,
          role: profileData.role as UserRole,
          subscription_tier: profileData.trainers?.subscription_tier,
          subscription_status: profileData.trainers?.subscription_status,
          trainer_id: profileData.students?.trainer_id
        };
      }
      return null;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session state:', session ? 'Active' : 'No session');
        
        if (session?.user) {
          console.log('User authenticated:', session.user.id);
          setUser(session.user);
          
          let profileData = await fetchProfile(session.user.id);
          
          // If no profile exists, create one
          if (!profileData) {
            const role = session.user.user_metadata.role as UserRole || 'trainer';
            profileData = await createProfile(session.user.id, session.user.email!, role);
          }
          
          if (profileData) {
            console.log('Profile loaded:', profileData.role);
            setProfile(profileData);
          }
        } else {
          console.log('No active session');
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          console.log('User authenticated in listener:', session.user.id);
          setUser(session.user);
          
          let profileData = await fetchProfile(session.user.id);
          
          // If no profile exists, create one
          if (!profileData) {
            const role = session.user.user_metadata.role as UserRole || 'trainer';
            profileData = await createProfile(session.user.id, session.user.email!, role);
          }
          
          if (profileData) {
            console.log('Profile updated in listener:', profileData.role);
            setProfile(profileData);
          }
        } else {
          console.log('User signed out');
          setUser(null);
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