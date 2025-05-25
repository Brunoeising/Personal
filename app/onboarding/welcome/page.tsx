"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DumbbellIcon as DumbellIcon, CheckCircle } from "lucide-react";
import { useSupabase } from "@/lib/providers/supabase-provider";
import OnboardingLayout from "@/components/layouts/onboarding-layout";

export default function WelcomePage() {
  const { user, loading } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  
  const plan = searchParams.get("plan") || "free";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setName(user.user_metadata.full_name || "");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <OnboardingLayout currentStep={1} totalSteps={5}>
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <DumbellIcon size={32} className="text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-2">Welcome to FitPro, {name}!</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            You're about to transform how you manage your personal training business. Let's get started with a few quick steps.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-md mb-8"
        >
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle size={20} className="text-primary mr-2" />
              Your account is ready
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              You've chosen the <span className="font-medium">{plan.toUpperCase()}</span> plan.
              {plan === "free"
                ? " You can upgrade anytime as your business grows."
                : " Great choice! You'll have access to advanced features."}
            </p>
            <div className="text-sm bg-muted p-3 rounded-lg">
              <p className="font-medium mb-1">Next steps:</p>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Set up your professional profile</li>
                <li>Configure your account settings</li>
                <li>Add your first client</li>
              </ul>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button size="lg" asChild>
            <Link href="/onboarding/profile">
              Continue
            </Link>
          </Button>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
}