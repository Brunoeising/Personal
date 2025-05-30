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
import { useExercises } from "@/hooks/use-exercises";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Copy,
  Trash,
  Eye,
  Video,
  Image as ImageIcon,
} from "lucide-react";

export default function ExercisesPage() {
  const { exercises, loading, deleteExercise } = useExercises();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscle_group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        <header className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Biblioteca de Exercícios
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gerencie sua biblioteca de exercícios
            </p>
          </div>
          <Button asChild>
            <Link href="/exercises/create">
              <Plus className="mr-2 h-4 w-4" />
              Novo Exercício
            </Link>
          </Button>
        </header>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Lista de Exercícios</CardTitle>
                <CardDescription>
                  {exercises.length} exercícios na biblioteca
                </CardDescription>
              </div>
              
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
                      <TableHead>Grupo Muscular</TableHead>
                      <TableHead>Equipamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {exercise.description}
                            </p>
                            <div className="flex gap-2 mt-1">
                              {exercise.video_url && (
                                <Badge variant="outline" className="text-xs">
                                  <Video className="h-3 w-3 mr-1" />
                                  Vídeo
                                </Badge>
                              )}
                              {exercise.image_url && (
                                <Badge variant="outline" className="text-xs">
                                  <ImageIcon className="h-3 w-3 mr-1" />
                                  Imagem
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{exercise.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{exercise.difficulty}</Badge>
                        </TableCell>
                        <TableCell>{exercise.muscle_group}</TableCell>
                        <TableCell>{exercise.equipment}</TableCell>
                        <TableCell>
                          <Badge variant={exercise.is_public ? "default" : "secondary"}>
                            {exercise.is_public ? "Público" : "Privado"}
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
                                <Link href={`/exercises/${exercise.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalhes
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/exercises/${exercise.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteExercise(exercise.id)}
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