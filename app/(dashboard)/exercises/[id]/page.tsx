"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/lib/providers/supabase-provider";
import { useExercises } from "@/hooks/use-exercises";
import {
  ArrowLeft,
  Edit,
  Video,
  Image as ImageIcon,
  Dumbbell,
  Target,
  BarChart3,
  Box,
  AlertTriangle,
} from "lucide-react";

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const { toast } = useToast();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchExercise = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setExercise(data);
    } catch (error: any) {
      toast({
        title: "Error loading exercise",
        description: error.message,
        variant: "destructive",
      });
      router.push('/exercises');
    } finally {
      setLoading(false);
    }
  }, [params.id, supabase, toast, router]);

  useEffect(() => {
    if (params.id) {
      fetchExercise();
    }
  }, [params.id, fetchExercise]);

  if (loading) {
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

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto p-4 sm:p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Exercise not found</h3>
              <p className="text-muted-foreground mb-4">
                The exercise you are looking for does not exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/exercises">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to List
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                <h1 className="text-2xl font-bold">{exercise.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge>{exercise.category}</Badge>
                  <Badge variant="outline">{exercise.difficulty}</Badge>
                  {exercise.is_public && (
                    <Badge variant="secondary">Public</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button asChild>
              <Link href={`/exercises/${exercise.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Exercise
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {exercise.description}
                </p>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exercise.instructions.split('\n').map((instruction: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Media Preview */}
            {(exercise.video_url || exercise.image_url) && (
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exercise.video_url && (
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Video Demonstration</p>
                          <a 
                            href={exercise.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Watch video
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {exercise.image_url && (
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Exercise Image</p>
                          <a 
                            href={exercise.image_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View image
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exercise Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Muscle Group</p>
                    <p className="text-sm text-muted-foreground">{exercise.muscle_group}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Difficulty</p>
                    <p className="text-sm text-muted-foreground">{exercise.difficulty}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Box className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Equipment</p>
                    <p className="text-sm text-muted-foreground">{exercise.equipment || "None required"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notes */}
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Safety Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Always maintain proper form throughout the exercise
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Start with lighter weights to perfect technique
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Stop if you experience any unusual pain
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}