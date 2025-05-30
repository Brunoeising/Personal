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
import { ArrowLeft, Save } from "lucide-react";

const exerciseSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres",
  }),
  description: z.string().min(10, {
    message: "Descrição deve ter pelo menos 10 caracteres",
  }),
  instructions: z.string().min(10, {
    message: "Instruções devem ter pelo menos 10 caracteres",
  }),
  category: z.string({
    required_error: "Selecione uma categoria",
  }),
  equipment: z.string({
    required_error: "Selecione um equipamento",
  }),
  difficulty: z.string({
    required_error: "Selecione uma dificuldade",
  }),
  muscle_group: z.string({
    required_error: "Selecione um grupo muscular",
  }),
  video_url: z.string().url("URL inválida").optional().or(z.literal("")),
  image_url: z.string().url("URL inválida").optional().or(z.literal("")),
  is_public: z.boolean().default(false),
});

type FormData = z.infer<typeof exerciseSchema>;

export default function CreateExercisePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createExercise } = useExercises();
  const [isLoading, setIsLoading] = useState(false);

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

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const exercise = await createExercise(data);
      if (exercise) {
        toast({
          title: "Exercício criado com sucesso!",
          description: "O exercício foi adicionado à sua biblioteca",
        });
        router.push("/exercises");
      }
    } finally {
      setIsLoading(false);
    }
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
              Voltar
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold">Criar Novo Exercício</h1>
              <p className="text-muted-foreground">
                Adicione um novo exercício à sua biblioteca
              </p>
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Exercício</CardTitle>
            <CardDescription>
              Preencha as informações do exercício
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
                      <FormLabel>Nome do Exercício</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Supino Reto" {...field} />
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
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o exercício e seus benefícios"
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
                      <FormLabel>Instruções</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Instruções detalhadas de execução"
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
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Força">Força</SelectItem>
                            <SelectItem value="Cardio">Cardio</SelectItem>
                            <SelectItem value="Flexibilidade">Flexibilidade</SelectItem>
                            <SelectItem value="Peso Corporal">Peso Corporal</SelectItem>
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
                        <FormLabel>Equipamento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o equipamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Barra">Barra</SelectItem>
                            <SelectItem value="Halter">Halter</SelectItem>
                            <SelectItem value="Máquina">Máquina</SelectItem>
                            <SelectItem value="Nenhum">Nenhum</SelectItem>
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
                        <FormLabel>Dificuldade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a dificuldade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Iniciante">Iniciante</SelectItem>
                            <SelectItem value="Intermediário">Intermediário</SelectItem>
                            <SelectItem value="Avançado">Avançado</SelectItem>
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
                        <FormLabel>Grupo Muscular</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o grupo muscular" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Peito">Peito</SelectItem>
                            <SelectItem value="Costas">Costas</SelectItem>
                            <SelectItem value="Pernas">Pernas</SelectItem>
                            <SelectItem value="Ombros">Ombros</SelectItem>
                            <SelectItem value="Braços">Braços</SelectItem>
                            <SelectItem value="Core">Core</SelectItem>
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
                      <FormLabel>URL do Vídeo (Opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://youtube.com/..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Link para vídeo demonstrativo do exercício
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
                      <FormLabel>URL da Imagem (Opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://exemplo.com/imagem.jpg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Link para imagem ilustrativa do exercício
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
                        <FormLabel>Exercício Público</FormLabel>
                        <FormDescription>
                          Tornar este exercício visível para outros trainers
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
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Criando..." : "Criar Exercício"}
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