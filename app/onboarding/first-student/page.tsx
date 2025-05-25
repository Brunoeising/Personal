"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSupabase } from "@/lib/providers/supabase-provider";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import OnboardingLayout from "@/components/layouts/onboarding-layout";

const studentSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  age: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Age must be a number",
  }),
  goal: z.string().min(2, {
    message: "Goal must be at least 2 characters",
  }),
  notes: z.string().max(500, {
    message: "Notes must be 500 characters or less",
  }).optional(),
});

export default function FirstStudentPage() {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skipAdding, setSkipAdding] = useState(false);

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "male",
      age: "",
      goal: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof studentSchema>) {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Insert student record
      const { error } = await supabase
        .from('students')
        .insert({
          trainer_id: user.id,
          full_name: values.name,
          email: values.email,
          phone: values.phone || null,
          gender: values.gender,
          age: parseInt(values.age),
          goal: values.goal,
          notes: values.notes || null,
        });

      if (error) throw error;

      toast({
        title: "Student added",
        description: `${values.name} has been added to your clients`,
      });

      router.push("/onboarding/complete");
    } catch (error: any) {
      toast({
        title: "Error adding student",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSkip = () => {
    setSkipAdding(true);
    setTimeout(() => {
      router.push("/onboarding/complete");
    }, 500);
  };

  if (skipAdding) {
    return (
      <OnboardingLayout currentStep={4} totalSteps={5}>
        <div className="flex flex-col items-center text-center">
          <UserPlus size={48} className="text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-2">Skipping for now</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            No problem! You can add students anytime from your dashboard.
          </p>
          <div className="animate-pulse">Redirecting...</div>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout currentStep={4} totalSteps={5}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Add Your First Client</h1>
          <p className="text-muted-foreground">
            Let's add your first client to get started. You can add more later.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="client@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      They'll receive an invite to join
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+55 (11) 98765-4321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Goal</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Weight loss, muscle gain, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any health concerns, past injuries, or preferences"
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maximum 500 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Back
              </Button>
              <div className="space-x-4">
                <Button variant="ghost" type="button" onClick={handleSkip}>
                  Skip for now
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Client & Continue"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </OnboardingLayout>
  );
}