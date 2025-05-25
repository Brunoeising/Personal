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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dummy data
const dummyStudents = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    status: "active",
    goal: "Muscle gain",
    progress: 78,
    startDate: "2023-01-15",
    lastSession: "2023-09-18",
    nextSession: "2023-09-25",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria@example.com",
    status: "active",
    goal: "Weight loss",
    progress: 65,
    startDate: "2023-02-20",
    lastSession: "2023-09-20",
    nextSession: "2023-09-27",
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos@example.com",
    status: "inactive",
    goal: "Rehabilitation",
    progress: 32,
    startDate: "2023-03-10",
    lastSession: "2023-08-15",
    nextSession: null,
  },
  {
    id: 4,
    name: "Ana Pereira",
    email: "ana@example.com",
    status: "active",
    goal: "General fitness",
    progress: 45,
    startDate: "2023-04-05",
    lastSession: "2023-09-19",
    nextSession: "2023-09-26",
  },
  {
    id: 5,
    name: "Roberto Alves",
    email: "roberto@example.com",
    status: "onboarding",
    goal: "Strength training",
    progress: 15,
    startDate: "2023-09-01",
    lastSession: null,
    nextSession: "2023-09-22",
  },
];

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter students based on search query and active tab
  const filteredStudents = dummyStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
                         
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && student.status === "active";
    if (activeTab === "inactive") return matchesSearch && student.status === "inactive";
    if (activeTab === "onboarding") return matchesSearch && student.status === "onboarding";
    
    return matchesSearch;
  });

  return (
    <div className="p-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage and track all your clients in one place
          </p>
        </div>
        <Button asChild>
          <Link href="/students/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Students Overview</CardTitle>
          <CardDescription>
            You have {dummyStudents.length} students total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Students</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <StudentTable students={filteredStudents} />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <StudentTable students={filteredStudents} />
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <StudentTable students={filteredStudents} />
            </TabsContent>
            <TabsContent value="onboarding" className="mt-4">
              <StudentTable students={filteredStudents} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentTable({ students }) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Goal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Progress</TableHead>
            <TableHead className="hidden lg:table-cell">Next Session</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                No students found. Try a different search or add a new student.
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src="" alt={student.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {student.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{student.goal}</TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{student.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {student.nextSession ? formatDate(student.nextSession) : 'Not scheduled'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/students/${student.id}`}>
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/students/${student.id}/workouts`} className="flex items-center">
                          <Activity className="mr-2 h-4 w-4" />
                          Workouts
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/students/${student.id}/chat`} className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/students/${student.id}/progress`} className="flex items-center">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Progress
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/appointments/new?student=${student.id}`} className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Session
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/students/${student.id}/message`} className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }) {
  let variant;
  let label;

  switch (status) {
    case "active":
      variant = "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      label = "Active";
      break;
    case "inactive":
      variant = "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      label = "Inactive";
      break;
    case "onboarding":
      variant = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      label = "Onboarding";
      break;
    default:
      variant = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
      label = status;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant}`}>
      {label}
    </span>
  );
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}