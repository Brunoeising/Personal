"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Calendar,
  BarChart3,
  MessageSquare,
  Activity,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  Edit,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSupabase } from "@/lib/providers/supabase-provider";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'onboarding' | 'paused';
  goal: string;
  progress: number;
  birth_date?: string;
  last_session?: string;
  next_session?: string;
  avatar_url?: string;
  total_sessions?: number;
  monthly_goal?: number;
  created_at: string;
  updated_at: string;
  workout_sessions?: {
    count: number;
    last_session?: string;
  }[];
  appointments?: {
    next_session?: string;
  }[];
}

export default function StudentsPage() {
  const { supabase, user } = useSupabase();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            workout_sessions (
              count,
              last_session:completed_at(max)
            ),
            appointments!inner (
              next_session:start_time(min)
            )
          `)
          .eq('trainer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process the data
        const processedStudents = data.map(student => ({
          ...student,
          total_sessions: student.workout_sessions?.[0]?.count || 0,
          last_session: student.workout_sessions?.[0]?.last_session,
          next_session: student.appointments?.[0]?.next_session,
          progress: Math.floor(Math.random() * 100) // Temporary - implement real logic
        }));

        setStudents(processedStudents);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar alunos",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user, supabase, toast]);

  // Stats calculation
  const stats = useMemo(() => {
    const active = students.filter(s => s.status === 'active').length;
    const inactive = students.filter(s => s.status === 'inactive').length;
    const onboarding = students.filter(s => s.status === 'onboarding').length;
    const paused = students.filter(s => s.status === 'paused').length;
    const total = students.length;
    
    return { active, inactive, onboarding, paused, total };
  }, [students]);

  // Filter students based on search and active tab
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = 
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.goal?.toLowerCase().includes(searchQuery.toLowerCase());
                         
      if (activeTab === "all") return matchesSearch;
      return matchesSearch && student.status === activeTab;
    });
  }, [searchQuery, activeTab, students]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Meus Alunos
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gerencie e acompanhe todos os seus alunos em um só lugar
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/students/create">
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Aluno
            </Link>
          </Button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Ativos</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.active}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Novos</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.onboarding}</p>
                </div>
                <Plus className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pausados</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.paused}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Inativos</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.inactive}</p>
                </div>
                <Users className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Lista de Alunos</CardTitle>
                <CardDescription>
                  Você tem {stats.total} alunos cadastrados
                </CardDescription>
              </div>
              
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar alunos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Filter Tabs */}
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  Todos ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="active" className="text-xs sm:text-sm">
                  Ativos ({stats.active})
                </TabsTrigger>
                <TabsTrigger value="onboarding" className="text-xs sm:text-sm">
                  Novos ({stats.onboarding})
                </TabsTrigger>
                <TabsTrigger value="paused" className="text-xs sm:text-sm">
                  Pausados ({stats.paused})
                </TabsTrigger>
                <TabsTrigger value="inactive" className="text-xs sm:text-sm">
                  Inativos ({stats.inactive})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                {/* Students Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Aluno</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Progresso</TableHead>
                        <TableHead className="font-semibold">Próxima Sessão</TableHead>
                        <TableHead className="font-semibold">Total Sessões</TableHead>
                        <TableHead className="text-right font-semibold">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-12 w-12 text-muted-foreground/50" />
                              <p className="text-lg font-medium">Nenhum aluno encontrado</p>
                              <p className="text-sm">Tente uma busca diferente ou adicione um novo aluno</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={student.avatar_url} alt={student.name} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {student.name?.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-xs text-muted-foreground">{student.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={student.status} />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-300" 
                                    style={{ width: `${student.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium min-w-[3rem]">{student.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {student.next_session ? (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    {formatDate(student.next_session)}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Não agendada</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <span className="font-semibold">{student.total_sessions || 0}</span>
                                <p className="text-xs text-muted-foreground">sessões</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <StudentActions student={student} />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StudentActions({ student }: { student: Student }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/students/${student.id}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Ver Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/students/${student.id}/edit`} className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/students/${student.id}/workouts`} className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Treinos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/students/${student.id}/progress`} className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Progresso
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/students/${student.id}/chat`} className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/appointments/new?student=${student.id}`} className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Sessão
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`mailto:${student.email}`} className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Enviar Email
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`tel:${student.phone}`} className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            Ligar
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusBadge({ status }: { status: Student['status'] }) {
  const variants = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    inactive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    onboarding: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    paused: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  const labels = {
    active: "Ativo",
    inactive: "Inativo",
    onboarding: "Novo",
    paused: "Pausado",
  };

  return (
    <Badge className={variants[status]}>
      {labels[status]}
    </Badge>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}