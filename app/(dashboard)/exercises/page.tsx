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
  Zap,
  Users,
  Activity
} from "lucide-react";

// Tipo TypeScript para exercício
interface Exercise {
  id: number;
  name: string;
  category: 'Força' | 'Peso Corporal' | 'Cardio' | 'Flexibilidade';
  equipment: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  muscleGroup: string;
  isPublic: boolean;
  description?: string;
  instructions?: string[];
  timesUsed?: number;
}

// Dados de exemplo para exercícios
const exercises: Exercise[] = [
  {
    id: 1,
    name: "Supino Reto",
    category: "Força",
    equipment: "Barra",
    difficulty: "Intermediário",
    muscleGroup: "Peito",
    isPublic: true,
    timesUsed: 25,
    description: "Exercício clássico para fortalecimento do peitoral"
  },
  {
    id: 2,
    name: "Agachamento",
    category: "Força",
    equipment: "Barra",
    difficulty: "Avançado",
    muscleGroup: "Pernas",
    isPublic: true,
    timesUsed: 42,
    description: "Movimento fundamental para desenvolvimento das pernas"
  },
  {
    id: 3,
    name: "Barra Fixa",
    category: "Peso Corporal",
    equipment: "Barra de Apoio",
    difficulty: "Intermediário",
    muscleGroup: "Costas",
    isPublic: true,
    timesUsed: 18,
    description: "Exercício de peso corporal para fortalecimento das costas"
  },
  {
    id: 4,
    name: "Flexão de Braço",
    category: "Peso Corporal",
    equipment: "Nenhum",
    difficulty: "Iniciante",
    muscleGroup: "Peito",
    isPublic: false,
    timesUsed: 35,
    description: "Exercício básico de peso corporal"
  },
  {
    id: 5,
    name: "Rosca Direta",
    category: "Força",
    equipment: "Halter",
    difficulty: "Iniciante",
    muscleGroup: "Braços",
    isPublic: true,
    timesUsed: 12,
    description: "Exercício isolado para bíceps"
  },
  {
    id: 6,
    name: "Prancha",
    category: "Peso Corporal",
    equipment: "Nenhum",
    difficulty: "Iniciante",
    muscleGroup: "Core",
    isPublic: true,
    timesUsed: 28,
    description: "Exercício isométrico para fortalecimento do core"
  },
  {
    id: 7,
    name: "Corrida na Esteira",
    category: "Cardio",
    equipment: "Esteira",
    difficulty: "Iniciante",
    muscleGroup: "Cardio",
    isPublic: true,
    timesUsed: 8,
    description: "Exercício cardiovascular básico"
  },
  {
    id: 8,
    name: "Alongamento de Isquiotibiais",
    category: "Flexibilidade",
    equipment: "Nenhum",
    difficulty: "Iniciante",
    muscleGroup: "Pernas",
    isPublic: true,
    timesUsed: 15,
    description: "Alongamento para músculos posteriores da coxa"
  }
];

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const total = exercises.length;
    const forca = exercises.filter(e => e.category === 'Força').length;
    const pesoCorporal = exercises.filter(e => e.category === 'Peso Corporal').length;
    const cardio = exercises.filter(e => e.category === 'Cardio').length;
    const flexibilidade = exercises.filter(e => e.category === 'Flexibilidade').length;
    const publicos = exercises.filter(e => e.isPublic).length;
    const privados = exercises.filter(e => !e.isPublic).length;
    
    return { total, forca, pesoCorporal, cardio, flexibilidade, publicos, privados };
  }, []);

  // Filtrar exercícios baseado na busca, aba ativa e filtros
  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeTab === "all" || exercise.category === activeTab;
      const matchesEquipment = selectedEquipment === "all" || exercise.equipment === selectedEquipment;
      const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesEquipment && matchesDifficulty;
    });
  }, [searchQuery, activeTab, selectedEquipment, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header responsivo */}
        <header className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Biblioteca de Exercícios
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gerencie e organize sua coleção de exercícios
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/exercises/create">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Exercício
            </Link>
          </Button>
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
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Força</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.forca}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Peso Corporal</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.pesoCorporal}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Cardio</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.cardio}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cartão principal */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Lista de Exercícios</CardTitle>
                <CardDescription>
                  Você tem {stats.total} exercícios na sua biblioteca
                </CardDescription>
              </div>
              
              {/* Barra de pesquisa */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar exercícios..."
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
                <TabsTrigger value="Força" className="text-xs sm:text-sm">
                  Força ({stats.forca})
                </TabsTrigger>
                <TabsTrigger value="Peso Corporal" className="text-xs sm:text-sm">
                  Corpo ({stats.pesoCorporal})
                </TabsTrigger>
                <TabsTrigger value="Cardio" className="text-xs sm:text-sm">
                  Cardio ({stats.cardio})
                </TabsTrigger>
                <TabsTrigger value="Flexibilidade" className="text-xs sm:text-sm">
                  Flex ({stats.flexibilidade})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6 space-y-4">
                {/* Filtros adicionais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Equipamentos</SelectItem>
                      <SelectItem value="Barra">Barra</SelectItem>
                      <SelectItem value="Halter">Halter</SelectItem>
                      <SelectItem value="Máquina">Máquina</SelectItem>
                      <SelectItem value="Nenhum">Nenhum Equipamento</SelectItem>
                      <SelectItem value="Esteira">Esteira</SelectItem>
                      <SelectItem value="Barra de Apoio">Barra de Apoio</SelectItem>
                    </SelectContent>
                  </Select>

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
                </div>

                <ExerciseTable exercises={filteredExercises} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ExerciseTable({ exercises }: { exercises: Exercise[] }) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Categoria</TableHead>
              <TableHead className="font-semibold">Equipamento</TableHead>
              <TableHead className="font-semibold">Dificuldade</TableHead>
              <TableHead className="font-semibold">Grupo Muscular</TableHead>
              <TableHead className="font-semibold">Usos</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Dumbbell className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-lg font-medium">Nenhum exercício encontrado</p>
                    <p className="text-sm">Tente uma busca diferente ou adicione um novo exercício</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              exercises.map((exercise) => (
                <TableRow key={exercise.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-48">
                        {exercise.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={exercise.category} />
                  </TableCell>
                  <TableCell className="text-sm">{exercise.equipment}</TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={exercise.difficulty} />
                  </TableCell>
                  <TableCell className="text-sm font-medium">{exercise.muscleGroup}</TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-semibold">{exercise.timesUsed || 0}</span>
                      <p className="text-xs text-muted-foreground">vezes</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={exercise.isPublic 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }>
                      {exercise.isPublic ? "Público" : "Privado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ExerciseActions exercise={exercise} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {exercises.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Dumbbell className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <p className="text-lg font-medium">Nenhum exercício encontrado</p>
                <p className="text-sm text-muted-foreground">Tente uma busca diferente ou adicione um novo exercício</p>
              </div>
              <Button asChild>
                <Link href="/exercises/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Exercício
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          exercises.map((exercise) => (
            <Card key={exercise.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Header do card */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {exercise.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CategoryBadge category={exercise.category} />
                      <DifficultyBadge difficulty={exercise.difficulty} />
                    </div>
                  </div>
                  <ExerciseActions exercise={exercise} />
                </div>

                {/* Informações principais */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Equipamento</p>
                    <p className="font-medium truncate">{exercise.equipment}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Grupo Muscular</p>
                    <p className="font-medium">{exercise.muscleGroup}</p>
                  </div>
                </div>

                {/* Footer do card */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Badge className={exercise.isPublic 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }>
                      {exercise.isPublic ? "Público" : "Privado"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Usado {exercise.timesUsed || 0} vezes
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

function ExerciseActions({ exercise }: { exercise: Exercise }) {
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
          <Link href={`/exercises/${exercise.id}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/exercises/${exercise.id}/edit`} className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Duplicar
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

function CategoryBadge({ category }: { category: Exercise['category'] }) {
  const variants = {
    'Força': "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    'Peso Corporal': "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    'Cardio': "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    'Flexibilidade': "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <Badge className={variants[category]}>
      {category}
    </Badge>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Exercise['difficulty'] }) {
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