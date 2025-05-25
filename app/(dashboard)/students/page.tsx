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

// Tipos TypeScript
interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'onboarding' | 'paused';
  goal: string;
  progress: number;
  startDate: string;
  lastSession: string | null;
  nextSession: string | null;
  avatar?: string;
  totalSessions?: number;
  monthlyGoal?: number;
}

// Dados de exemplo
const dummyStudents: Student[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    phone: "(11) 99999-9999",
    status: "active",
    goal: "Ganho de massa muscular",
    progress: 78,
    startDate: "2023-01-15",
    lastSession: "2023-09-18",
    nextSession: "2023-09-25",
    totalSessions: 45,
    monthlyGoal: 16,
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria@example.com",
    phone: "(11) 88888-8888",
    status: "active",
    goal: "Perda de peso",
    progress: 65,
    startDate: "2023-02-20",
    lastSession: "2023-09-20",
    nextSession: "2023-09-27",
    totalSessions: 32,
    monthlyGoal: 12,
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos@example.com",
    phone: "(11) 77777-7777",
    status: "inactive",
    goal: "Reabilitação",
    progress: 32,
    startDate: "2023-03-10",
    lastSession: "2023-08-15",
    nextSession: null,
    totalSessions: 18,
    monthlyGoal: 8,
  },
  {
    id: 4,
    name: "Ana Pereira",
    email: "ana@example.com",
    phone: "(11) 66666-6666",
    status: "active",
    goal: "Condicionamento físico",
    progress: 45,
    startDate: "2023-04-05",
    lastSession: "2023-09-19",
    nextSession: "2023-09-26",
    totalSessions: 28,
    monthlyGoal: 12,
  },
  {
    id: 5,
    name: "Roberto Alves",
    email: "roberto@example.com",
    phone: "(11) 55555-5555",
    status: "onboarding",
    goal: "Treinamento de força",
    progress: 15,
    startDate: "2023-09-01",
    lastSession: null,
    nextSession: "2023-09-22",
    totalSessions: 3,
    monthlyGoal: 16,
  },
  {
    id: 6,
    name: "Fernanda Costa",
    email: "fernanda@example.com",
    phone: "(11) 44444-4444",
    status: "paused",
    goal: "Fortalecimento core",
    progress: 55,
    startDate: "2023-05-10",
    lastSession: "2023-08-30",
    nextSession: null,
    totalSessions: 24,
    monthlyGoal: 10,
  },
];

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Estatísticas calculadas
  const stats = useMemo(() => {
    const active = dummyStudents.filter(s => s.status === 'active').length;
    const inactive = dummyStudents.filter(s => s.status === 'inactive').length;
    const onboarding = dummyStudents.filter(s => s.status === 'onboarding').length;
    const paused = dummyStudents.filter(s => s.status === 'paused').length;
    const total = dummyStudents.length;
    
    return { active, inactive, onboarding, paused, total };
  }, []);

  // Filtrar alunos baseado na busca e aba ativa
  const filteredStudents = useMemo(() => {
    return dummyStudents.filter((student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.goal.toLowerCase().includes(searchQuery.toLowerCase());
                         
      if (activeTab === "all") return matchesSearch;
      return matchesSearch && student.status === activeTab;
    });
  }, [searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header responsivo */}
        <header className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Meus Alunos
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gerencie e acompanhe todos os seus clientes em um só lugar
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/students/create">
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Aluno
            </Link>
          </Button>
        </header>

        {/* Cards de estatísticas */}
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

        {/* Cartão principal */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Lista de Alunos</CardTitle>
                <CardDescription>
                  Você tem {stats.total} alunos cadastrados no total
                </CardDescription>
              </div>
              
              {/* Barra de pesquisa */}
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
            {/* Tabs de filtro */}
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
                <StudentTable students={filteredStudents} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StudentTable({ students }: { students: Student[] }) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Aluno</TableHead>
              <TableHead className="font-semibold">Objetivo</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Progresso</TableHead>
              <TableHead className="font-semibold">Próxima Sessão</TableHead>
              <TableHead className="font-semibold">Total Sessões</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-lg font-medium">Nenhum aluno encontrado</p>
                    <p className="text-sm">Tente uma busca diferente ou adicione um novo aluno</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {student.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-32">
                      <p className="text-sm font-medium truncate">{student.goal}</p>
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
                      {student.nextSession ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(student.nextSession)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Não agendada</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-semibold">{student.totalSessions || 0}</span>
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

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {students.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Users className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <p className="text-lg font-medium">Nenhum aluno encontrado</p>
                <p className="text-sm text-muted-foreground">Tente uma busca diferente ou adicione um novo aluno</p>
              </div>
              <Button asChild>
                <Link href="/students/create">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Aluno
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          students.map((student) => (
            <Card key={student.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Header do card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {student.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{student.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={student.status} />
                      </div>
                    </div>
                  </div>
                  <StudentActions student={student} />
                </div>

                {/* Informações principais */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Objetivo</p>
                    <p className="font-medium truncate">{student.goal}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sessões</p>
                    <p className="font-medium">{student.totalSessions || 0} realizadas</p>
                  </div>
                </div>

                {/* Progresso */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-medium">{student.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-300" 
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>

                {/* Próxima sessão */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Próxima sessão:</span>
                  <span className="text-sm font-medium">
                    {student.nextSession ? formatDate(student.nextSession) : 'Não agendada'}
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
          <Link href={`/students/${student.id}/message`} className="flex items-center">
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