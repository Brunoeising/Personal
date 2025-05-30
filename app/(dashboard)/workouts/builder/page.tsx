"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@dnd-kit/core";
import { useExercises } from "@/hooks/use-exercises";
import { useWorkouts } from "@/hooks/use-workouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Search,
  Plus,
  Grip,
  X,
  Save,
  DumbbellIcon
} from "lucide-react";

export default function WorkoutBuilderPage() {
  const router = useRouter();
  const { exercises } = useExercises();
  const { createWorkout } = useWorkouts();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscle_group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedExercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedExercises(items);
  };

  const addExercise = (exercise: any) => {
    setSelectedExercises([...selectedExercises, {
      ...exercise,
      sets: 3,
      reps: "12",
      rest_seconds: 60
    }]);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!workoutName) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, dê um nome ao treino",
        variant: "destructive"
      });
      return;
    }

    if (selectedExercises.length === 0) {
      toast({
        title: "Nenhum exercício selecionado",
        description: "Adicione pelo menos um exercício ao treino",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const workout = await createWorkout({
        name: workoutName,
        description: `Treino criado com ${selectedExercises.length} exercícios`,
        duration_minutes: selectedExercises.length * 5, // Estimativa básica
        difficulty: "Intermediário",
        category: "Força",
        is_public: false
      }, selectedExercises.map(exercise => ({
        exercise_id: exercise.id,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_seconds: exercise.rest_seconds
      })));

      if (workout) {
        toast({
          title: "Treino criado com sucesso!",
          description: "O treino foi adicionado à sua biblioteca"
        });
        router.push("/workouts");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6">
        <header className="mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="self-start"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Constructor de Treino</h1>
              <p className="text-muted-foreground">
                Monte seu treino arrastando os exercícios
              </p>
            </div>

            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Salvando..." : "Salvar Treino"}
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Exercícios disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>Exercícios Disponíveis</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar exercícios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{exercise.muscle_group}</Badge>
                          <Badge variant="outline">{exercise.equipment}</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addExercise(exercise)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Treino em construção */}
          <Card>
            <CardHeader>
              <CardTitle>Treino em Construção</CardTitle>
              <Input
                placeholder="Nome do treino"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="mt-2"
              />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="exercises">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {selectedExercises.map((exercise, index) => (
                          <Draggable
                            key={`${exercise.id}-${index}`}
                            draggableId={`${exercise.id}-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab"
                                >
                                  <Grip className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{exercise.name}</h3>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline">
                                      {exercise.sets} séries
                                    </Badge>
                                    <Badge variant="outline">
                                      {exercise.reps} reps
                                    </Badge>
                                    <Badge variant="outline">
                                      {exercise.rest_seconds}s descanso
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeExercise(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {selectedExercises.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                    <DumbbellIcon className="h-12 w-12 mb-4" />
                    <p>Arraste exercícios aqui para montar seu treino</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}