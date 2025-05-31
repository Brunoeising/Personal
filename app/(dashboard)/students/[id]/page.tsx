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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/lib/providers/supabase-provider";
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  Target, 
  Activity, 
  BarChart3, 
  MessageSquare,
  MapPin,
  User,
  Clock,
  TrendingUp,
  AlertTriangle,
  Pill,
  Users,
  Settings
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  goal: string;
  health_conditions: string;
  medications: string;
  exercise_experience: string;
  availability: string;
  preferred_time: string;
  monthly_goal: number;
  status: string;
  notes: string;
  avatar_url: string;
  is_active: boolean;
  progress: number;
  total_sessions: number;
  created_at: string;
  updated_at: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  const fetchStudent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', params.id)
        .eq('trainer_id', user?.id)
        .single();

      if (error) throw error;
      setStudent(data);
    } catch (error: any) {
      toast({
        title: "Error loading student",
        description: error.message,
        variant: "destructive",
      });
      router.push('/students');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, user?.id, supabase, toast, router]);

  const fetchRecentSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('student_sessions')
        .select('*')
        .eq('student_id', params.id)
        .eq('trainer_id', user?.id)
        .order('session_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  }, [params.id, user?.id, supabase]);

  useEffect(() => {
    if (params.id) {
      fetchStudent();
      fetchRecentSessions();
    }
  }, [params.id, fetchStudent, fetchRecentSessions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "onboarding": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: "Ativo",
      inactive: "Inativo",
      onboarding: "Novo",
      paused: "Pausado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getExperienceLabel = (experience: string) => {
    const labels = {
      iniciante: "Iniciante",
      intermediario: "Intermediário",
      avancado: "Avançado",
    };
    return labels[experience as keyof typeof labels] || experience;
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
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

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto p-4 sm:p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aluno não encontrado</h3>
              <p className="text-muted-foreground mb-4">
                O aluno que você está procurando não existe ou foi removido.
              </p>
              <Button asChild>
                <Link href="/students">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Lista
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
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="shrink-0"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={student.avatar_url} alt={student.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {student.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{student.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(student.status)}>
                      {getStatusLabel(student.status)}
                    </Badge>
                    {student.birth_date && (
                      <span className="text-sm text-muted-foreground">
                        {calculateAge(student.birth_date)} anos
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/students/${student.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/students/${student.id}/workouts`}>
                  <Activity className="mr-2 h-4 w-4" />
                  Treinos
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Progresso</p>
                      <p className="text-2xl font-bold">{student.progress}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sessões</p>
                      <p className="text-2xl font-bold">{student.total_sessions}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Meta Mensal</p>
                      <p className="text-2xl font-bold">{student.monthly_goal}</p>
                    </div>
                    <Target className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Experiência</p>
                      <p className="text-lg font-bold">{getExperienceLabel(student.exercise_experience)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Objetivo e notas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivo Principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{student.goal}</p>
                
                {student.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Observações</h4>
                    <p className="text-sm text-muted-foreground">{student.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações de saúde */}
            {(student.health_conditions || student.medications) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Informações de Saúde
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.health_conditions && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Condições de Saúde
                      </h4>
                      <p className="text-sm text-muted-foreground bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                        {student.health_conditions}
                      </p>
                    </div>
                  )}
                  
                  {student.medications && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Medicamentos
                      </h4>
                      <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                        {student.medications}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Ações rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button variant="outline" asChild className="h-auto flex-col py-4">
                    <Link href={`/students/${student.id}/workouts`}>
                      <Activity className="h-6 w-6 mb-2" />
                      <span className="text-sm">Treinos</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="h-auto flex-col py-4">
                    <Link href={`/students/${student.id}/progress`}>
                      <BarChart3 className="h-6 w-6 mb-2" />
                      <span className="text-sm">Progresso</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="h-auto flex-col py-4">
                    <Link href={`/students/${student.id}/chat`}>
                      <MessageSquare className="h-6 w-6 mb-2" />
                      <span className="text-sm">Chat</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="h-auto flex-col py-4">
                    <Link href={`/appointments/new?student=${student.id}`}>
                      <Calendar className="h-6 w-6 mb-2" />
                      <span className="text-sm">Agendar</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações de contato */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <a 
                      href={`mailto:${student.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {student.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Telefone</p>
                    <a 
                      href={`tel:${student.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {student.phone}
                    </a>
                  </div>
                </div>

                {student.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Endereço</p>
                      <p className="text-sm text-muted-foreground">{student.address}</p>
                    </div>
                  </div>
                )}

                {(student.emergency_contact || student.emergency_phone) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                        Contato de Emergência
                      </h4>
                      
                      {student.emergency_contact && (
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Nome</p>
                            <p className="text-sm text-muted-foreground">{student.emergency_contact}</p>
                          </div>
                        </div>
                      )}
                      
                      {student.emergency_phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Telefone</p>
                            <a 
                              href={`tel:${student.emergency_phone}`}
                              className="text-sm text-red-600 hover:underline dark:text-red-400"
                            >
                              {student.emergency_phone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Disponibilidade */}
            {(student.availability || student.preferred_time) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Disponibilidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {student.availability && (
                    <div>
                      <p className="text-sm font-medium">Dias disponíveis</p>
                      <p className="text-sm text-muted-foreground">{student.availability}</p>
                    </div>
                  )}
                  
                  {student.preferred_time && (
                    <div>
                      <p className="text-sm font-medium">Horário preferencial</p>
                      <p className="text-sm text-muted-foreground">{student.preferred_time}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Informações do cadastro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Informações do Cadastro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Data de cadastro</p>
                  <p className="text-sm text-muted-foreground">{formatDate(student.created_at)}</p>
                </div>
                
                {student.updated_at !== student.created_at && (
                  <div>
                    <p className="text-sm font-medium">Última atualização</p>
                    <p className="text-sm text-muted-foreground">{formatDate(student.updated_at)}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium">Status da conta</p>
                  <p className="text-sm text-muted-foreground">
                    {student.is_active ? 'Ativo' : 'Desativado'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sessões recentes */}
            {recentSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Sessões Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSessions.slice(0, 3).map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{formatDate(session.session_date)}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.duration_minutes ? `${session.duration_minutes} min` : 'Duração não informada'}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {session.status === 'completed' ? 'Concluída' : session.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  {recentSessions.length > 3 && (
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={`/students/${student.id}/workouts`}>
                          Ver todas as sessões
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}