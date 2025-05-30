"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { useWorkouts } from "@/hooks/use-workouts";
import { useExercises } from "@/hooks/use-exercises";
import { ArrowLeft, Plus, Save, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ExerciseItem {
  id: string;
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

function SortableExerciseItem({ item, onRemove, exercises }: { 
  item: ExerciseItem; 
  onRemove: () => void;
  exercises: any[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const exercise = exercises.find(e => e.id === item.exerciseId);

  return (
    <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-4 mb-4">
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-move">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={item.exerciseId} onValueChange={(value) => {}}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o exercício" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input 
            type="number" 
            placeholder="Séries" 
            value={item.sets} 
            onChange={() => {}}
          />

          <Input 
            placeholder="Repetições" 
            value={item.reps} 
            onChange={() => {}}
          />

          <Input 
            type="number" 
            placeholder="Descanso (seg)" 
            value={item.restSeconds} 
            onChange={() => {}}
          />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {exercise && (
        <div className="mt-4 pl-9">
          <p className="text-sm text-muted-foreground">{exercise.description}</p>
        </div>
      )}
    </div>
  );
}

export default function WorkoutBuilderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { exercises } = useExercises();
  const { createWorkout } = useWorkouts();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ExerciseItem[]>([]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addExercise = () => {
    const newItem: ExerciseItem = {
      id: crypto.randomUUID(),
      exerciseId: "",
      sets: 3,
      reps: "12",
      restSeconds: 60,
    };
    setItems([...items, newItem]);
  };

  const removeExercise = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Implementation for saving the workout
      toast({
        title: "Treino criado com sucesso!",
        description: "O treino foi adicionado à sua biblioteca",
      });
      router.push("/workouts");
    } catch (error) {
      toast({
        title: "Erro ao criar treino",
        description: "Ocorreu um erro ao salvar o treino",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
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
            
            <div>
              <h1 className="text-2xl font-bold">Constructor de Treino</h1>
              <p className="text-muted-foreground">
                Monte seu treino arrastando e soltando os exercícios
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Treino</CardTitle>
              <CardDescription>
                Informações básicas do treino
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Nome do treino" />
                <Input type="number" placeholder="Duração (minutos)" />
              </div>

              <Textarea placeholder="Descrição do treino" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forca">Força</SelectItem>
                    <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                    <SelectItem value="resistencia">Resistência</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Exercícios</CardTitle>
                  <CardDescription>
                    Arraste para reordenar os exercícios
                  </CardDescription>
                </div>
                <Button onClick={addExercise} type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Exercício
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={items} 
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((item) => (
                    <SortableExerciseItem
                      key={item.id}
                      item={item}
                      onRemove={() => removeExercise(item.id)}
                      exercises={exercises}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {items.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum exercício adicionado</p>
                  <p className="text-sm">Clique no botão acima para adicionar exercícios</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch id="public" />
              <label htmlFor="public" className="text-sm">
                Tornar este treino público
              </label>
            </div>

            <div className="space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Treino"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}