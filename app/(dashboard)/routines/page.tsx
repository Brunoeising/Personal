"use client";

import { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Copy,
  Trash,
  Eye,
  Calendar,
  Target,
  Users,
  Clock,
  Play,
  Pause,
  BarChart3,
  Share2,
  Download,
  UserCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

// Tipos TypeScript
interface Routine {
  id: number;
  name: string;
  student: {
    id: number;
    name: string;
    avatar?: string;
  };
  phase: 'Adaptação' | 'Desenvolvimento' | 'Intensificação' | 'Polimento' | 'Transição';
  status: 'Ativa' | 'Pausada' | 'Concluída' | 'Pendente';
  startDate: string;
  endDate: string;
  duration: number; // em semanas
  workoutsPerWeek: number;
  totalWorkouts: number;
  completedWorkouts: number;
  adherenceRate: number; // porcentagem
  goal: string;
  createdAt: string;
  lastActivity: string;
  nextWorkout?: string;
  templates: string[]; // nomes dos templates usados
}

// Dados de exemplo para rotinas
const routines: Routine[] = [
  {
    id: 1,
    name: "Hipertrofia - João",
    student: {
      id: 1,
      name: "João Silva",
      avatar: ""
    },
    phase: "Desenvolvimento",
    status: "Ativa",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    duration: 12,
    workoutsPerWeek: 4,
    totalWorkouts: 48,
    completedWorkouts: 28,
    adherenceRate: 87,
    goal: "Ganho de massa muscular",
    createdAt: "2024-01-10",
    lastActivity: "2024-02-18",
    nextWorkout: "2024-02-20",
    templates: ["Treino A - Peito", "Treino B - Costas", "Treino C - Pernas"]
  },
  {
    id: 2,
    name: "Emagrecimento - Maria",
    student: {
      id: 2,
      name: "Maria Oliveira",
      avatar: ""
    },
    phase: "Intensificação",
    status: "Ativa",
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    duration: 12,
    workoutsPerWeek: 5,
    totalWorkouts: 60,
    completedWorkouts: 18,
    adherenceRate: 92,
    goal: "Perda de peso",
    createdAt: "2024-01-25",
    lastActivity: "2024-02-19",
    nextWorkout: "2024-02-21",
    templates: ["HIIT Queima Gordura", "Cardio Esteira", "Funcional"]
  },
  {
    id: 3,
    name: "Reabilitação - Carlos",
    student: {
      id: 3,
      name: "Carlos Santos",
      avatar: ""
    },
    phase: "Adaptação",
    status: "Pausada",
    startDate: "2024-01-20",
    endDate: "2024-03-20",
    duration: 8,
    workoutsPerWeek: 3,
    totalWorkouts: 24,
    completedWorkouts: 8,
    adherenceRate: 67,
    goal: "Reabilitação joelho",
    createdAt: "2024-01-15",
    lastActivity: "2024-02-10",
    templates: ["Reab. Joelho", "Fortalecimento"]
  },
  {
    id: 4,
    name: "Condicionamento - Ana",
    student: {
      id: 4,
      name: "Ana Pereira",
      avatar: ""
    },
    phase: "Desenvolvimento",
    status: "Ativa",
    startDate: "2024-02-05",
    endDate: "2024-04-05",
    duration: 8,
    workoutsPerWeek: 3,
    totalWorkouts: 24,
    completedWorkouts: 12,
    adherenceRate: 100,
    goal: "Condicionamento físico",
    createdAt: "2024-02-01",
    lastActivity: "2024-02-19",
    nextWorkout: "2024-02-22",
    templates: ["Funcional Iniciante", "Cardio", "Força Básica"]
  },
  {
    id: 5,
    name: "Força - Roberto",
    student: {
      id: 5,
      name: "Roberto Alves",
      avatar: ""
    },
    phase: "Polimento",
    status: "Ativa",
    startDate: "2024-01-01",
    endDate: "2024-04-01",
    duration: 16,
    workoutsPerWeek: 4,
    totalWorkouts: 64,
    completedWorkouts: 52,
    adherenceRate: 89,
    goal: "Aumento de força",
    createdAt: "2023-12-20",
    lastActivity: "2024-02-18",
    nextWorkout: "2024-02-21",
    templates: ["Força Avançada", "Potência", "Técnica"]
  },
  {
    id: 6,
    name: "Iniciante - Fernanda",
    student: {
      id: 6,
      name: "Fernanda Costa",
      avatar: ""
    },
    phase: "Adaptação",
    status: "Pendente",
    startDate: "2024-02-22",
    endDate: "2024-05-22",
    duration: 12,
    workoutsPerWeek: 3,
    totalWorkouts: 36,
    completedWorkouts: 0,
    adherenceRate: 0,
    goal: "Condicionamento inicial",
    createdAt: "2024-02-15",
    lastActivity: "2024-02-15",
    templates: ["Funcional Iniciante", "Adaptação"]
  }
];

export default function RoutinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const total = routines.length;
    const ativas = routines.filter(r => r.status === 'Ativa').length;
    const pausadas = routines.filter(r => r.status === 'Pausada').length;
    const concluidas = routines.filter(r => r.status === 'Concluída').length;
    const pendentes = routines.filter(r => r.status === 'Pendente').length;
    const aderenciaMedia = Math.round(
      routines.reduce((acc, r) => acc + r.adherenceRate, 0) / routines.length
    );
    const totalTreinos = routines.reduce((acc, r) => acc + r.completedWorkouts, 0);
    
    return { total, ativas, pausadas, concluidas, pendentes, aderenciaMedia, totalTreinos };
  }, []);

  // Filtrar rotinas baseado na busca, aba ativa e filtros
  const filteredRoutines = useMemo(() => {
    return routines.filter((routine) => {
      const matchesSearch = 
        routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.goal.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = activeTab === "all" || routine.status === activeTab;
      const matchesPhase = selectedPhase === "all" || routine.phase === selectedPhase;
      const matchesStudent = selectedStudent === "all" || routine.student.id.toString() === selectedStudent;

      return matchesSearch && matchesStatus && matchesPhase && matchesStudent;
    });
  }, [searchQuery, activeTab, selectedPhase, selectedStudent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header responsivo */}
        <header className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Rotinas de Treino
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gerencie rotinas periodizadas e acompanhe o progresso dos alunos
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/routines/assign">
                <UserCheck className="mr-2 h-4 w-4" />
                Atribuir Rotina
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/routines/create">
                <Plus className="mr-2 h-4 w-4" />
                Nova Rotina
              </Link>
            </Button>
          </div>
        </header>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Ativas</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.ativas}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Aderência</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.aderenciaMedia}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Treinos</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.totalTreinos}</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cartão principal */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Lista de Rotinas</CardTitle>
                <CardDescription>
                  Você tem {stats.total} rotinas criadas ({stats.ativas} ativas)
                </CardDescription>
              </div>
              
              {/* Barra de pesquisa */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar rotinas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Tabs de filtro */}
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  Todas ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="Ativa" className="text-xs sm:text-sm">
                  Ativas ({stats.ativas})
                </TabsTrigger>
                <TabsTrigger value="Pausada" className="text-xs sm:text-sm">
                  Pausadas ({stats.pausadas})
                </TabsTrigger>
                <TabsTrigger value="Pendente" className="text-xs sm:text-sm">
                  Pendentes ({stats.pendentes})
                </TabsTrigger>
                <TabsTrigger value="Concluída" className="text-xs sm:text-sm">
                  Concluídas ({stats.concluidas})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6 space-y-4">
                {/* Filtros adicionais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fase de Treinamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Fases</SelectItem>
                      <SelectItem value="Adaptação">Adaptação</SelectItem>
                      <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                      <SelectItem value="Intensificação">Intensificação</SelectItem>
                      <SelectItem value="Polimento">Polimento</SelectItem>
                      <SelectItem value="Transição">Transição</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Alunos</SelectItem>
                      {Array.from(new Set(routines.map(r => r.student))).map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <RoutineTable routines={filteredRoutines} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RoutineTable({ routines }: { routines: Routine[] }) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Rotina & Aluno</TableHead>
              <TableHead className="font-semibold">Fase</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Progresso</TableHead>
              <TableHead className="font-semibold">Aderência</TableHead>
              <TableHead className="font-semibold">Próximo Treino</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Calendar className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-lg font-medium">Nenhuma rotina encontrada</p>
                    <p className="text-sm">Tente uma busca diferente ou crie uma nova rotina</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              routines.map((routine) => (
                <TableRow key={routine.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={routine.student.avatar} alt={routine.student.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {routine.student.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{routine.name}</p>
                        <p className="text-xs text-muted-foreground">{routine.goal}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PhaseBadge phase={routine.phase} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={routine.status} />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{routine.completedWorkouts}/{routine.totalWorkouts}</span>
                        <span className="text-muted-foreground">
                          {Math.round((routine.completedWorkouts / routine.totalWorkouts) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(routine.completedWorkouts / routine.totalWorkouts) * 100} 
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        routine.adherenceRate >= 90 ? 'bg-green-500' : 
                        routine.adherenceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">{routine.adherenceRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {routine.nextWorkout ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {formatDate(routine.nextWorkout)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {routine.status === 'Concluída' ? 'Finalizada' : 'Não agendado'}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RoutineActions routine={routine} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {routines.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <p className="text-lg font-medium">Nenhuma rotina encontrada</p>
                <p className="text-sm text-muted-foreground">Tente uma busca diferente ou crie uma nova rotina</p>
              </div>
              <Button asChild>
                <Link href="/routines/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Rotina
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          routines.map((routine) => (
            <Card key={routine.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Header do card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={routine.student.avatar} alt={routine.student.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {routine.student.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{routine.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{routine.goal}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <PhaseBadge phase={routine.phase} />
                        <StatusBadge status={routine.status} />
                      </div>
                    </div>
                  </div>
                  <RoutineActions routine={routine} />
                </div>

                {/* Progresso */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-medium">
                      {routine.completedWorkouts}/{routine.totalWorkouts}
                    </span>
                  </div>
                  <Progress 
                    value={(routine.completedWorkouts / routine.totalWorkouts) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Informações principais */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Aderência</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        routine.adherenceRate >= 90 ? 'bg-green-500' : 
                        routine.adherenceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <p className="font-medium">{routine.adherenceRate}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frequência</p>
                    <p className="font-medium">{routine.workoutsPerWeek}x por semana</p>
                  </div>
                </div>

                {/* Footer do card */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Próximo treino:
                  </span>
                  <span className="text-sm font-medium">
                    {routine.nextWorkout ? formatDate(routine.nextWorkout) : 'Não agendado'}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

function RoutineActions({ routine }: { routine: Routine }) {
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
          <Link href={`/routines/${routine.id}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/routines/${routine.id}/edit`} className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Duplicar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/students/${routine.student.id}/progress`} className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Ver Progresso
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {routine.status === 'Ativa' ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pausar Rotina
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Ativar Rotina
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Relatório PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusBadge({ status }: { status: Routine['status'] }) {
  const variants = {
    'Ativa': "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    'Pausada': "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    'Concluída': "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    'Pendente': "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <Badge className={variants[status]}>
      {status}
    </Badge>
  );
}

function PhaseBadge({ phase }: { phase: Routine['phase'] }) {
  const variants = {
    'Adaptação': "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    'Desenvolvimento': "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    'Intensificação': "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    'Polimento': "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    'Transição': "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <Badge className={variants[phase]}>
      {phase}
    </Badge>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit',
    month: 'short',
  });
}