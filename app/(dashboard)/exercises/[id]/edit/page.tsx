"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useExercises } from "@/hooks/use-exercises";
import { useSupabase } from "@/lib/providers/supabase-provider";
import { ArrowLeft, Save, X } from "lucide-react";

const exerciseSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  instructions: z.string().min(10, {
    message: "Instructions must be at least 10 characters",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  equipment: z.string({
    required_error: "Please select equipment",
  }),
  difficulty: z.string({
    required_error: "Please select difficulty",
  }),
  muscle_group: z.string({
    required_error: "Please select muscle group",
  }),
  video_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  is_public: z.boolean().default(false),
});

type FormData = z.infer<typeof exerciseSchema>;

export default function EditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const { toast } = useToast();
  const { updateExercise } = useExercises();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      description: "",
      instructions: "",
      category: "",
      equipment: "",
      difficulty: "",
      muscle_group: "",
      video_url: "",
      image_url: "",
      is_public: false,
    },
  });

  const fetchExercise = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      
      form.reset({
        name: data.name,
        description: data.description,
        instructions: data.instructions,
        category: data.category,
        equipment: data.equipment,
        difficulty: data.difficulty,
        muscle_group: data.muscle_group,
        video_url: data.video_url || "",
        image_url: data.image_url || "",
        is_public: data.is_public,
      });
    } catch (error: any) {
      toast({
        title: "Error loading exercise",
        description: error.message,
        variant: "destructive",
      });
      router.push('/exercises');
    } finally {
      setIsLoadingData(false);
    }
  }, [params.id, supabase, toast, router, form]);

  useEffect(() => {
    if (params.id) {
      fetchExercise();
    }
  }, [params.id, fetchExercise]);

  async function onSubmit(values: FormData) {
    if (!params.id) return;
    
    setIsLoading(true);
    try {
      await updateExercise(params.id, values);
      
      toast({
        title: "Exercise updated",
        description: "The exercise has been updated successfully",
      });
      
      router.push(`/exercises/${params.id}`);
    } catch (error: any) {
      toast({
        title: "Error updating exercise",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto p-4 sm:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <header className="mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="self-start"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold">Edit Exercise</h1>
              <p className="text-muted-foreground">
                Update exercise information
              </p>
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Exercise Details</CardTitle>
            <CardDescription>
              Update the exercise information below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bench Press" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the exercise and its benefits"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Step-by-step instructions for proper execution"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Strength">Strength</SelectItem>
                            <SelectItem value="Cardio">Cardio</SelectItem>
                            <SelectItem value="Flexibility">Flexibility</SelectItem>
                            <SelectItem value="Balance">Balance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select equipment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Barbell">Barbell</SelectItem>
                            <SelectItem value="Dumbbell">Dumbbell</SelectItem>
                            <SelectItem value="Kettlebell">Kettlebell</SelectItem>
                            <SelectItem value="Machine">Machine</SelectItem>
                            <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                            <SelectItem value="Resistance Band">Resistance Band</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="muscle_group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Muscle Group</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select muscle group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Chest">Chest</SelectItem>
                            <SelectItem value="Back">Back</SelectItem>
                            <SelectItem value="Legs">Legs</SelectItem>
                            <SelectItem value="Shoulders">Shoulders</SelectItem>
                            <SelectItem value="Arms">Arms</SelectItem>
                            <SelectItem value="Core">Core</SelectItem>
                            <SelectItem value="Full Body">Full Body</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://youtube.com/..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Link to a demonstration video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Link to an illustration or photo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_public"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Public Exercise</FormLabel>
                        <FormDescription>
                          Make this exercise visible to other trainers
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}