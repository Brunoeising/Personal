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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/lib/providers/supabase-provider";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Video, 
  Image, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle 
} from "lucide-react";

const exerciseSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do exercício deve ter pelo menos 2 caracteres",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres",
  }),
  instructions: z.string().min(10, {
    message: "As instruções devem ter pelo menos 10 caracteres",
  }),
  category: z.string({
    required_error: "Por favor selecione uma categoria",
  }),
  equipment: z.string({
    required_error: "Por favor selecione o tipo de equipamento",
  }),
  difficulty: z.string({
    required_error: "Por favor selecione o nível de dificuldade",
  }),
  muscleGroup: z.string({
    required_error: "Por favor selecione o grupo muscular principal",
  }),
  videoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  isPublic: z.boolean().default(false),
});

export default function CreateExercisePage() {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      description: "",
      instructions: "",
      category: "",
      equipment: "",
      difficulty: "",
      muscleGroup: "",
      videoUrl: "",
      imageUrl: "",
      isPublic: false,
    },
  });

  async function onSubmit(values: z.infer<typeof exerciseSchema>) {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar exercícios",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('exercises')
        .insert({
          trainer_id: user.id,
          name: values.name,
          description: values.description,
          instructions: values.instructions,
          category: values.category,
          equipment: values.equipment,
          difficulty: values.difficulty,
          muscle_group: values.muscleGroup,
          video_url: values.videoUrl || null,
          image_url: values.imageUrl || null,
          is_public: values.isPublic,
        });

      if (error) throw error;

      toast({
        title: "Exercício criado com sucesso!",
        description: "O exercício foi adicionado à sua biblioteca",
      });

      router.push("/exercises");
    } catch (error: any) {
      toast({
        title: "Erro ao criar exercício",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Intermediário": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Avançado": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        {/* Header responsivo */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="self-start"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Criar Novo Exercício
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Adicione um novo exercício à sua biblioteca
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulário principal */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Detalhes do Exercício
                </CardTitle>
                <CardDescription>
                  Preencha as informações do seu novo exercício
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nome e descrição */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">
                              Nome do Exercício
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="ex: Supino com Barra" 
                                className="h-11"
                                {...field} 
                              />
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
                            <FormLabel className="text-base font-semibold">
                              Descrição
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Breve descrição do exercício e seus benefícios"
                                className="h-20 resize-none"
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
                            <FormLabel className="text-base font-semibold">
                              Instruções de Execução
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Instruções detalhadas passo a passo para execução correta"
                                className="h-32 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Seja específico sobre postura, respiração e técnica
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Campos de seleção em grid responsivo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Categoria</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Força">💪 Força</SelectItem>
                                <SelectItem value="Cardio">❤️ Cardio</SelectItem>
                                <SelectItem value="Flexibilidade">🤸 Flexibilidade</SelectItem>
                                <SelectItem value="Equilíbrio">⚖️ Equilíbrio</SelectItem>
                                <SelectItem value="Pliométrico">⚡ Pliométrico</SelectItem>
                                <SelectItem value="Funcional">🔄 Funcional</SelectItem>
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
                            <FormLabel className="font-semibold">Equipamento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Selecione o equipamento" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Barra">🏋️ Barra</SelectItem>
                                <SelectItem value="Halter">🔩 Halter</SelectItem>
                                <SelectItem value="Kettlebell">⚫ Kettlebell</SelectItem>
                                <SelectItem value="Máquina">⚙️ Máquina</SelectItem>
                                <SelectItem value="Peso Corporal">🧘 Peso Corporal</SelectItem>
                                <SelectItem value="Elástico">🎗️ Elástico</SelectItem>
                                <SelectItem value="Cabo">📱 Cabo</SelectItem>
                                <SelectItem value="Outro">➕ Outro</SelectItem>
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
                            <FormLabel className="font-semibold">Dificuldade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Selecione a dificuldade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Iniciante">🟢 Iniciante</SelectItem>
                                <SelectItem value="Intermediário">🟡 Intermediário</SelectItem>
                                <SelectItem value="Avançado">🔴 Avançado</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="muscleGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Grupo Muscular Principal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Selecione o grupo muscular" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Peito">🫀 Peito</SelectItem>
                                <SelectItem value="Costas">🦴 Costas</SelectItem>
                                <SelectItem value="Pernas">🦵 Pernas</SelectItem>
                                <SelectItem value="Ombros">💪 Ombros</SelectItem>
                                <SelectItem value="Braços">💪 Braços</SelectItem>
                                <SelectItem value="Core">🎯 Core</SelectItem>
                                <SelectItem value="Corpo Inteiro">🔄 Corpo Inteiro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* URLs de mídia */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 font-semibold">
                              <Video className="h-4 w-4" />
                              URL do Vídeo (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://youtube.com/watch?v=..." 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Link para vídeo demonstrativo (YouTube, Vimeo, etc.)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 font-semibold">
                              <Image className="h-4 w-4" />
                              URL da Imagem (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://exemplo.com/imagem.jpg" 
                                className="h-11"
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
                    </div>

                    {/* Switch de visibilidade */}
                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                          <div className="space-y-0.5">
                            <FormLabel className="flex items-center gap-2 text-base font-semibold">
                              {field.value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              Exercício Público
                            </FormLabel>
                            <FormDescription>
                              Torne este exercício visível para outros personal trainers
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

                    {/* Botões de ação */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="order-2 sm:order-1"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="order-1 sm:order-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Criando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Criar Exercício
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com preview e dicas */}
          <div className="space-y-6">
            {/* Preview do exercício */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>
                  Como o exercício aparecerá na biblioteca
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">
                    {form.watch("name") || "Nome do exercício"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("description") || "Descrição do exercício..."}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {form.watch("category") && (
                    <Badge variant="secondary">{form.watch("category")}</Badge>
                  )}
                  {form.watch("difficulty") && (
                    <Badge className={getDifficultyColor(form.watch("difficulty"))}>
                      {form.watch("difficulty")}
                    </Badge>
                  )}
                  {form.watch("muscleGroup") && (
                    <Badge variant="outline">{form.watch("muscleGroup")}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {form.watch("isPublic") ? (
                    <>
                      <Eye className="h-4 w-4 text-green-500" />
                      <span className="text-green-700 dark:text-green-400">Público</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-700 dark:text-yellow-400">Privado</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Dicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Use nomes descritivos e específicos para facilitar a busca
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Inclua instruções detalhadas de postura e respiração
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Vídeos demonstrativos aumentam a qualidade do exercício
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Exercícios públicos podem ser usados por outros trainers
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