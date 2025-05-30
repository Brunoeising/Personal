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
import { Badge } from "@/components/ui/badge";
import { useWorkouts } from "@/hooks/use-workouts";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Copy,
  Trash,
  Eye,
  Calendar,
  Clock,
  Dumbbell,
  Share2
} from "lucide-react";

export default function WorkoutsPage() {
  const { workouts, loading, deleteWorkout } = useWorkouts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        <header className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Biblioteca de Treinos
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gerencie seus templates de treino
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/workouts/builder">
                <Dumbbell className="mr-2 h-4 w-4" />
                Constructor Visual
              </Link>
            </Button>
            <Button asChild>
              <Link href="/workouts/create">
                <Plus className="mr-2 h-4 w-4" />
                Novo Treino
              </Link>
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Lista de Treinos</CardTitle>
                <CardDescription>
                  {workouts.length} treinos na biblioteca
                </CardDescription>
              </div>
              
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
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Dificuldade</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Exercícios</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkouts.map((workout) => (
                      <TableRow key={workout.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{workout.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {workout.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{workout.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{workout.difficulty}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{workout.duration_minutes}min</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {workout.exercises?.length || 0} exercícios
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={workout.is_public ? "default" : "secondary"}>
                            {workout.is_public ? "Público" : "Privado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/workouts/${workout.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalhes
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/workouts/${workout.id}/edit`}>
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
                                <Link href={`/routines/create?template=${workout.id}`}>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Criar Rotina
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                Compartilhar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteWorkout(workout.id)}
                              >
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}