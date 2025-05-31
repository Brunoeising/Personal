"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, DumbbellIcon as DumbellIcon, ArrowRight } from "lucide-react";
import OnboardingLayout from "@/components/layouts/onboarding-layout";
import { useToast } from "@/hooks/use-toast";

export default function CompletePage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Show toast when component mounts
    toast({
      title: "Setup complete!",
      description: "You&apos;re all set to start managing your fitness business",
    });
  }, [toast]);

  return (
    <OnboardingLayout currentStep={5} totalSteps={5}>
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-2">You&apos;re All Set!</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Your FitPro account is ready to use. You can now start managing your clients and creating personalized workouts.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-lg mb-8"
        >
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold mb-4">What&apos;s next?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                  <DumbellIcon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Explore your dashboard</p>
                  <p className="text-sm text-muted-foreground">
                    Get familiar with your new workspace
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                  <DumbellIcon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Create your first workout</p>
                  <p className="text-sm text-muted-foreground">
                    Design custom workouts for your clients
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                  <DumbellIcon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Invite more clients</p>
                  <p className="text-sm text-muted-foreground">
                    Grow your client list and your business
                  </p>
                </div>
              </li>
            </ul>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full max-w-md"
        >
          <Button size="lg" className="w-full" onClick={() => router.push("/dashboard")}>
            Go to Dashboard <ArrowRight size={16} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
}