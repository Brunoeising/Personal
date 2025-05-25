"use client";

import { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Copy,
  Trash,
  Eye,
} from "lucide-react";

// Dados de exemplo para exercícios
const exercises = [
  {
    id: 1,
    name: "Supino Reto",
    category: "Força",
    equipment: "Barra",
    difficulty: "Intermediário",
    muscleGroup: "Peito",
    isPublic: true,
  },
  {
    id: 2,
    name: "Agachamento",
    category: "Força",
    equipment: "Barra",
    difficulty: "Avançado",
    muscleGroup: "Pernas",
    isPublic: true,
  },
  {
    id: 3,
    name: "Barra Fixa",
    category: "Peso Corporal",
    equipment: "Barra de Apoio",
    difficulty: "Intermediário",
    muscleGroup: "Costas",
    isPublic: true,
  },
  {
    id: 4,
    name: "Flexão de Braço",
    category: "Peso Corporal",
    equipment: "Nenhum",
    difficulty: "Iniciante",
    muscleGroup: "Peito",
    isPublic: false,
  },
  {
    id: 5,
    name: "Rosca Direta",
    category: "Força",
    equipment: "Halter",
    difficulty: "Iniciante",
    muscleGroup: "Braços",
    isPublic: true,
  },
];

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Filtrar exercícios baseado na busca e filtros
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    const matchesEquipment = selectedEquipment === "all" || exercise.equipment === selectedEquipment;
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesEquipment && matchesDifficulty;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header responsivo */}
      <header className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Biblioteca de Exercícios</h1>
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

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Exercícios</CardTitle>
          <CardDescription className="text-sm">
            Navegue e gerencie sua biblioteca de exercícios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros responsivos */}
          <div className="space-y-4">
            {/* Barra de pesquisa */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar exercícios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Filtros em grid responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="Força">Força</SelectItem>
                  <SelectItem value="Peso Corporal">Peso Corporal</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                </SelectContent>
              </Select>

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
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="sm:col-span-2 lg:col-span-1">
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
          </div>

          {/* Tabela responsiva */}
          <div className="border rounded-lg overflow-hidden">
            {/* Desktop/Tablet View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Dificuldade</TableHead>
                    <TableHead>Grupo Muscular</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExercises.map((exercise) => (
                    <TableRow key={exercise.id}>
                      <TableCell className="font-medium">{exercise.name}</TableCell>
                      <TableCell>{exercise.category}</TableCell>
                      <TableCell>{exercise.equipment}</TableCell>
                      <TableCell>{exercise.difficulty}</TableCell>
                      <TableCell>{exercise.muscleGroup}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          exercise.isPublic 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                          {exercise.isPublic ? "Público" : "Privado"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar Exercício
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-3 p-4">
              {filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{exercise.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          exercise.isPublic 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                          {exercise.isPublic ? "Público" : "Privado"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">Categoria:</span> {exercise.category}
                        </div>
                        <div>
                          <span className="font-medium">Equipamento:</span> {exercise.equipment}
                        </div>
                        <div>
                          <span className="font-medium">Dificuldade:</span> {exercise.difficulty}
                        </div>
                        <div>
                          <span className="font-medium">Músculo:</span> {exercise.muscleGroup}
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
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
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Mensagem quando não há exercícios */}
          {filteredExercises.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum exercício encontrado com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}