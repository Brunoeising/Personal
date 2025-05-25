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
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Copy,
  Trash,
  Eye,
  Dumbbell,
  Target,
  Users,
  Clock,
  Play,
  Calendar,
  Download,
  Share2
} from "lucide-react";

// Tipos TypeScript
interface Workout {
  id: number;
  name: string;
  category: 'Força' | 'Cardio' | 'HIIT' | 'Funcional' | 'Reabilitação';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: number; // em minutos
  exerciseCount: number;
  muscleGroups: string[];
  equipment: string[];
  timesUsed: number;
  isPublic: boolean;
  createdAt: string;
  description: string;
  createdBy: string;
  estimatedCalories?: number;
}

// Dados de exemplo para treinos
const workouts: Workout[] = [
  {
    id: 1,
    name: "Treino A - Peito e Tríceps",
    category: "Força",
    difficulty: "Intermediário",
    duration: 45,
    exerciseCount: 8,
    muscleGroups: ["Peito", "Tríceps"],
    equipment: ["Barra", "Halter", "Banco"],
    timesUsed: 25,
    isPublic: true,
    createdAt: "2024-01-15",
    description: "Treino focado no desenvolvimento do peitoral e tríceps",
    createdBy: "Carlos Silva",
    estimatedCalories: 350
  },
  {
    id: 2,
    name: "HIIT Queima Gordura",
    category: "HIIT",
    difficulty: "Avançado",
    duration: 20,
    exerciseCount: 6,
    muscleGroups: ["Corpo Todo"],
    equipment: ["Nenhum"],
    timesUsed: 42,
    isPublic: true,
    createdAt: "2024-01-10",
    description: "Treino de alta intensidade para queima de gordura",
    createdBy: "Carlos Silva",
    estimatedCalories: 280
  },
  {
    id: 3,
    name: "Pernas Completo",
    category: "Força",
    difficulty: "Avançado",
    duration: 60,
    exerciseCount: 10,
    muscleGroups: ["Quadríceps", "Glúteos", "Panturrilha"],
    equipment: ["Barra", "Leg Press", "Smith"],
    timesUsed: 18,
    isPublic: false,
    createdAt: "2024-01-20",
    description: "Treino completo para membros inferiores",
    createdBy: "Carlos Silva",
    estimatedCalories: 420
  },
  {
    id: 4,
    name: "Funcional Iniciante",
    category: "Funcional",
    difficulty: "Iniciante",
    duration: 30,
    exerciseCount: 6,
    muscleGroups: ["Core", "Estabilização"],
    equipment: ["Medicine Ball", "TRX"],
    timesUsed: 35,
    isPublic: true,
    createdAt: "2024-02-01",
    description: "Treino funcional para iniciantes",
    createdBy: "Carlos Silva",
    estimatedCalories: 200
  },
  {
    id: 5,
    name: "Costas e Bíceps",
    category: "Força",
    difficulty: "Intermediário",
    duration: 50,
    exerciseCount: 9,
    muscleGroups: ["Costas", "Bíceps"],
    equipment: ["Barra", "Halter", "Polia"],
    timesUsed: 28,
    isPublic: true,
    createdAt: "2024-01-25",
    description: "Treino para desenvolvimento das costas e bíceps",
    createdBy: "Carlos Silva",
    estimatedCalories: 380
  },
  {
    id: 6,
    name: "Reab. Joelho",
    category: "Reabilitação",
    difficulty: "Iniciante",
    duration: 25,
    exerciseCount: 5,
    muscleGroups: ["Joelho", "Quadríceps"],
    equipment: ["Elástico", "Nenhum"],
    timesUsed: 12,
    isPublic: false,
    createdAt: "2024-02-05",
    description: "Protocolo de reabilitação para joelho",
    createdBy: "Carlos Silva",
    estimatedCalories: 120
  },
  {
    id: 7,
    name: "Cardio Esteira",
    category: "Cardio",
    difficulty: "Iniciante",
    duration: 35,
    exerciseCount: 3,
    muscleGroups: ["Cardio"],
    equipment: ["Esteira"],
    timesUsed: 8,
    isPublic: true,
    createdAt: "2024-02-08",
    description: "Treino cardiovascular progressivo na esteira",
    createdBy: "Carlos Silva",
    estimatedCalories: 300
  }
];

export default function WorkoutsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const total = workouts.length;
    const forca = workouts.filter(w => w.category === 'Força').length;
    const cardio = workouts.filter(w => w.category === 'Cardio').length;
    const hiit = workouts.filter(w => w.category === 'HIIT').length;
    const funcional = workouts.filter(w => w.category === 'Funcional').length;
    const reabilitacao = workouts.filter(w => w.category === 'Reabilitação').length;
    const totalUsos = workouts.reduce((acc, w) => acc + w.timesUsed, 0);
    const tempoMedio = Math.round(workouts.reduce((acc, w) => acc + w.duration, 0) / workouts.length);
    
    return { total, forca, cardio, hiit, funcional, reabilitacao, totalUsos, tempoMedio };
  }, []);

  // Filtrar treinos baseado na busca, aba ativa e filtros
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      const matchesSearch = 
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.muscleGroups.some(muscle => muscle.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeTab === "all" || workout.category === activeTab;
      const matchesDifficulty = selectedDifficulty === "all" || workout.difficulty === selectedDifficulty;
      const matchesEquipment = selectedEquipment === "all" || 
        workout.equipment.some(eq => eq === selectedEquipment) ||
        (selectedEquipment === "Nenhum" && workout.equipment.includes("Nenhum"));

      return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment;
    });
  }, [searchQuery, activeTab, selectedDifficulty, selectedEquipment]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header responsivo */}
        <header className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Templates de Treino
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Crie, gerencie e organize seus templates de treino
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/workouts/builder">
                <Dumbbell className="mr-2 h-4 w-4" />
                Constructor Visual
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/workouts/create">
                <Plus className="mr-2 h-4 w-4" />
                Novo Treino
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
                <Dumbbell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Usos Total</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.totalUsos}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Tempo Médio</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.tempoMedio}min</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Força</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.forca}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cartão principal */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Lista de Treinos</CardTitle>
                <CardDescription>
                  Você tem {stats.total} templates de treino criados
                </CardDescription>
              </div>
              
              {/* Barra de pesquisa */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar treinos..."
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
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  Todos ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="Força" className="text-xs sm:text-sm">
                  Força ({stats.forca})
                </TabsTrigger>
                <TabsTrigger value="Cardio" className="text-xs sm:text-sm">
                  Cardio ({stats.cardio})
                </TabsTrigger>
                <TabsTrigger value="HIIT" className="text-xs sm:text-sm">
                  HIIT ({stats.hiit})
                </TabsTrigger>
                <TabsTrigger value="Funcional" className="text-xs sm:text-sm">
                  Funcional ({stats.funcional})
                </TabsTrigger>
                <TabsTrigger value="Reabilitação" className="text-xs sm:text-sm">
                  Reab ({stats.reabilitacao})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6 space-y-4">
                {/* Filtros adicionais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Níveis</SelectItem>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos Equipamentos</SelectItem>
                      <SelectItem value="Nenhum">Peso Corporal</SelectItem>
                      <SelectItem value="Barra">Barra</SelectItem>
                      <SelectItem value="Halter">Halter</SelectItem>
                      <SelectItem value="Máquina">Máquina</SelectItem>
                      <SelectItem value="TRX">TRX</SelectItem>
                      <SelectItem value="Esteira">Esteira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <WorkoutTable workouts={filteredWorkouts} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WorkoutTable({ workouts }: { workouts: Workout[] }) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Categoria</TableHead>
              <TableHead className="font-semibold">Dificuldade</TableHead>
              <TableHead className="font-semibold">Duração</TableHead>
              <TableHead className="font-semibold">Exercícios</TableHead>
              <TableHead className="font-semibold">Grupos Musculares</TableHead>
              <TableHead className="font-semibold">Usos</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Dumbbell className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-lg font-medium">Nenhum treino encontrado</p>
                    <p className="text-sm">Tente uma busca diferente ou crie um novo treino</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              workouts.map((workout) => (
                <TableRow key={workout.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-48">
                        {workout.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={workout.category} />
                  </TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={workout.difficulty} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{workout.duration}min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-semibold">{workout.exerciseCount}</span>
                      <p className="text-xs text-muted-foreground">exercícios</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-32">
                      {workout.muscleGroups.slice(0, 2).map((muscle, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                      {workout.muscleGroups.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{workout.muscleGroups.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-semibold">{workout.timesUsed}</span>
                      <p className="text-xs text-muted-foreground">vezes</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <WorkoutActions workout={workout} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {workouts.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Dumbbell className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <p className="text-lg font-medium">Nenhum treino encontrado</p>
                <p className="text-sm text-muted-foreground">Tente uma busca diferente ou crie um novo treino</p>
              </div>
              <Button asChild>
                <Link href="/workouts/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Treino
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Header do card */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {workout.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CategoryBadge category={workout.category} />
                      <DifficultyBadge difficulty={workout.difficulty} />
                    </div>
                  </div>
                  <WorkoutActions workout={workout} />
                </div>

                {/* Informações principais */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Duração</p>
                    <p className="font-medium">{workout.duration} minutos</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Exercícios</p>
                    <p className="font-medium">{workout.exerciseCount} exercícios</p>
                  </div>
                </div>

                {/* Grupos musculares */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Grupos Musculares</p>
                  <div className="flex flex-wrap gap-1">
                    {workout.muscleGroups.map((muscle, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Footer do card */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Badge className={workout.isPublic 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }>
                      {workout.isPublic ? "Público" : "Privado"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Usado {workout.timesUsed} vezes
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

function WorkoutActions({ workout }: { workout: Workout }) {
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
          <Link href={`/workouts/${workout.id}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/workouts/${workout.id}/edit`} className="flex items-center">
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
          <Link href={`/routines/create?template=${workout.id}`} className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Criar Rotina
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
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

function CategoryBadge({ category }: { category: Workout['category'] }) {
  const variants = {
    'Força': "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    'Cardio': "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    'HIIT': "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    'Funcional': "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    'Reabilitação': "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <Badge className={variants[category]}>
      {category}
    </Badge>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Workout['difficulty'] }) {
  const variants = {
    'Iniciante': "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    'Intermediário': "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    'Avançado': "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Badge className={variants[difficulty]}>
      {difficulty}
    </Badge>
  );
}