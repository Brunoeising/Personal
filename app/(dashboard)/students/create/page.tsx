// app/(dashboard)/students/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
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
  User, 
  Upload,
  Trash2,
  FileImage,
  CheckCircle,
  AlertCircle,
  Target,
  Calendar,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const studentSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  goal: z.string().min(5, "Objetivo deve ter pelo menos 5 caracteres"),
  healthConditions: z.string().optional(),
  medications: z.string().optional(),
  exerciseExperience: z.string({
    required_error: "Selecione o nível de experiência",
  }),
  availability: z.string().optional(),
  preferredTime: z.string().optional(),
  monthlyGoal: z.coerce.number().min(1, "Meta mensal deve ser pelo menos 1").max(31, "Meta mensal não pode exceder 31"),
  status: z.string({
    required_error: "Selecione o status inicial",
  }),
  notes: z.string().optional(),
  avatarUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function CreateStudentPage() {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadedAvatarFile, setUploadedAvatarFile] = useState<File | null>(null);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      goal: "",
      healthConditions: "",
      medications: "",
      exerciseExperience: "",
      availability: "",
      preferredTime: "",
      monthlyGoal: 12,
      status: "onboarding",
      notes: "",
      avatarUrl: "",
      isActive: true,
    },
  });

  // Função para upload de avatar
  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatars/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `students/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('student-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('student-media')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message || "Falha ao fazer upload da foto",
        variant: "destructive",
      });
      return null;
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A foto deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    setUploadedAvatarFile(file);

    const url = await uploadAvatar(file);
    if (url) {
      form.setValue('avatarUrl', url);
      toast({
        title: "Foto enviada!",
        description: "A foto foi carregada com sucesso",
      });
    }
    setIsUploadingAvatar(false);
  };

  // Remove uploaded avatar
  const removeAvatar = () => {
    form.setValue('avatarUrl', '');
    setUploadedAvatarFile(null);
  };

  async function onSubmit(values: StudentFormData) {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar alunos",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('students')
        .insert({
          trainer_id: user.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          birth_date: values.birthDate || null,
          address: values.address || null,
          emergency_contact: values.emergencyContact || null,
          emergency_phone: values.emergencyPhone || null,
          goal: values.goal,
          health_conditions: values.healthConditions || null,
          medications: values.medications || null,
          exercise_experience: values.exerciseExperience,
          availability: values.availability || null,
          preferred_time: values.preferredTime || null,
          monthly_goal: values.monthlyGoal,
          status: values.status,
          notes: values.notes || null,
          avatar_url: values.avatarUrl || null,
          is_active: values.isActive,
        });

      if (error) throw error;

      toast({
        title: "Aluno criado com sucesso!",
        description: "O aluno foi adicionado à sua lista",
      });

      router.push("/students");
    } catch (error: any) {
      toast({
        title: "Erro ao criar aluno",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "onboarding": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "inactive": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      onboarding: "Novo",
      active: "Ativo", 
      paused: "Pausado",
      inactive: "Inativo"
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        {/* Header */}
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
                Adicionar Novo Aluno
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Cadastre um novo aluno em sua plataforma
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
                  <User className="h-5 w-5" />
                  Dados do Aluno
                </CardTitle>
                <CardDescription>
                  Preencha as informações do novo aluno
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Seção: Informações Pessoais */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <User className="h-4 w-4" />
                        <h3 className="font-semibold">Informações Pessoais</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="João Silva" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Data de Nascimento</FormLabel>
                              <FormControl>
                                <Input type="date" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 font-semibold">
                              <MapPin className="h-4 w-4" />
                              Endereço (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Rua das Flores, 123 - São Paulo, SP" 
                                className="h-11" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Seção: Contato */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Phone className="h-4 w-4" />
                        <h3 className="font-semibold">Informações de Contato</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 font-semibold">
                                <Mail className="h-4 w-4" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="joao@exemplo.com" 
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
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 font-semibold">
                                <Phone className="h-4 w-4" />
                                Telefone
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="(11) 99999-9999" 
                                  className="h-11" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="emergencyContact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Contato de Emergência</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Maria Silva (mãe)" 
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
                          name="emergencyPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Telefone de Emergência</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="(11) 88888-8888" 
                                  className="h-11" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Seção: Objetivos */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Target className="h-4 w-4" />
                        <h3 className="font-semibold">Objetivos e Experiência</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Objetivo Principal</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Perda de peso, ganho de massa muscular, melhora do condicionamento..."
                                className="h-20 resize-none"
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
                          name="exerciseExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Experiência com Exercícios</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Selecione o nível" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="iniciante">🟢 Iniciante</SelectItem>
                                  <SelectItem value="intermediario">🟡 Intermediário</SelectItem>
                                  <SelectItem value="avancado">🔴 Avançado</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="monthlyGoal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Meta Mensal (Sessões)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="31" 
                                  className="h-11" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormDescription>
                                Número de sessões por mês
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Seção: Saúde */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <AlertCircle className="h-4 w-4" />
                        <h3 className="font-semibold">Informações de Saúde</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="healthConditions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Condições de Saúde</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Lesões, limitações, doenças crônicas..."
                                  className="h-24 resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="medications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Medicamentos</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Medicamentos em uso regular..."
                                  className="h-24 resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Seção: Disponibilidade */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Calendar className="h-4 w-4" />
                        <h3 className="font-semibold">Disponibilidade</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Dias Disponíveis</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Segunda, Quarta, Sexta" 
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
                          name="preferredTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Horário Preferencial</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Manhã, Tarde, Noite" 
                                  className="h-11" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Seção: Status */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <CheckCircle className="h-4 w-4" />
                        <h3 className="font-semibold">Status e Configurações</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Status Inicial</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="onboarding">🟦 Novo (Onboarding)</SelectItem>
                                <SelectItem value="active">🟢 Ativo</SelectItem>
                                <SelectItem value="paused">🟡 Pausado</SelectItem>
                                <SelectItem value="inactive">🔴 Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Observações Gerais</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Anotações importantes sobre o aluno..."
                                className="h-24 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-semibold">
                                Aluno Ativo
                              </FormLabel>
                              <FormDescription>
                                O aluno pode acessar a plataforma e agendar sessões
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
                    </div>

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
                            Criar Aluno
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload de foto */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Foto do Aluno
                </CardTitle>
                <CardDescription>
                  Adicione uma foto de perfil (opcional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        isUploadingAvatar 
                          ? 'border-blue-300 bg-blue-50 dark:bg-blue-950/20' 
                          : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/50'
                      }`}
                    >
                      {isUploadingAvatar ? (
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                          <p className="mt-2 text-sm text-blue-600">Enviando...</p>
                        </div>
                      ) : uploadedAvatarFile ? (
                        <div className="flex flex-col items-center">
                          <FileImage className="h-8 w-8 text-green-500" />
                          <p className="mt-2 text-sm text-green-600 text-center">
                            {uploadedAvatarFile.name}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500 text-center">
                            Clique para enviar foto<br/>
                            <span className="text-xs">PNG, JPG até 5MB</span>
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  
                  {uploadedAvatarFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeAvatar}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover Foto
                    </Button>
                  )}

                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Ou URL da Foto</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://exemplo.com/foto.jpg" 
                            {...field}
                            disabled={!!uploadedAvatarFile}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Cole o link de uma foto externa
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>
                  Como o aluno aparecerá na lista
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {form.watch("name") ? 
                      form.watch("name").substring(0, 2).toUpperCase() : 
                      "AL"
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {form.watch("name") || "Nome do aluno"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("email") || "email@exemplo.com"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {form.watch("goal") && (
                    <p className="text-sm">
                      <strong>Objetivo:</strong> {form.watch("goal").substring(0, 50)}
                      {form.watch("goal").length > 50 && "..."}
                    </p>
                  )}
                  
                  {form.watch("status") && (
                    <Badge className={getStatusColor(form.watch("status"))}>
                      {getStatusLabel(form.watch("status"))}
                    </Badge>
                  )}
                  
                  {form.watch("monthlyGoal") && (
                    <p className="text-sm">
                      <strong>Meta:</strong> {form.watch("monthlyGoal")} sessões/mês
                    </p>
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
                    Preencha todas as informações de contato para melhor comunicação
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Informações de saúde são importantes para personalizar treinos
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    A meta mensal ajuda a acompanhar a frequência do aluno
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Uma foto ajuda na identificação rápida do aluno
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