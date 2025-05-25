"use client";

import Link from "next/link";
import { DumbbellIcon as DumbellIcon } from "lucide-react";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
}: OnboardingLayoutProps) {
  // Calculate progress percentage
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <DumbellIcon size={24} className="text-primary" />
            <span className="font-bold">FitPro</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-muted w-full">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full py-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-border text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} FitPro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}