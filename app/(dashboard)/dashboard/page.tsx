"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ActivitySquare,
  Users,
  Calendar,
  TrendingUp,
  BrainCircuit,
  ChevronRight,
  MessageSquare,
  User,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { useSupabase } from "@/lib/providers/supabase-provider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

// Demo data
const dummyStudents = [
  { id: 1, name: "João Silva", status: "active", progress: 78, nextSession: "Today, 15:00" },
  { id: 2, name: "Maria Oliveira", status: "active", progress: 65, nextSession: "Tomorrow, 10:00" },
  { id: 3, name: "Carlos Santos", status: "inactive", progress: 32, nextSession: "Not scheduled" },
];

const dummyActivities = [
  { id: 1, student: "João Silva", type: "workout_completed", time: "2 hours ago", message: "Completed 'Upper Body Strength' workout" },
  { id: 2, student: "Maria Oliveira", type: "message", time: "5 hours ago", message: "Sent you a message" },
  { id: 3, student: "Carlos Santos", type: "assessment_due", time: "1 day ago", message: "Monthly assessment is overdue" },
];

const dummyInsights = [
  { id: 1, type: "progression", title: "João Silva is ready to increase weight on bench press", confidence: 0.87, color: "text-green-500" },
  { id: 2, type: "risk", title: "Maria Oliveira shows signs of fatigue", confidence: 0.72, color: "text-amber-500" },
];

const weeklyProgressData = [
  { name: "Mon", sessions: 4, attendance: 80 },
  { name: "Tue", sessions: 6, attendance: 100 },
  { name: "Wed", sessions: 5, attendance: 90 },
  { name: "Thu", sessions: 7, attendance: 70 },
  { name: "Fri", sessions: 5, attendance: 60 },
  { name: "Sat", sessions: 3, attendance: 100 },
  { name: "Sun", sessions: 1, attendance: 100 },
];

export default function DashboardPage() {
  const { user } = useSupabase();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata.full_name || user.email?.split("@")[0] || "Trainer");
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userName}! Here's what's happening with your clients today.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <ActivitySquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58%</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-5">
        {/* Main content area - 3/5 width on large screens, full width on small */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          
          {/* Weekly Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>
                Sessions completed and attendance rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="attendance" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                The latest updates from your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="mr-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {activity.type === "workout_completed" && (
                          <ActivitySquare size={20} className="text-primary" />
                        )}
                        {activity.type === "message" && (
                          <MessageSquare size={20} className="text-primary" />
                        )}
                        {activity.type === "assessment_due" && (
                          <Calendar size={20} className="text-primary" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{activity.student}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar - 2/5 width on large screens, full width on small */}
        <div className="md:col-span-3 lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild className="h-auto flex-col py-4">
                  <Link href="/students/new">
                    <UserPlus className="mb-2 h-5 w-5" />
                    <span>Add Student</span>
                  </Link>
                </Button>
                <Button asChild className="h-auto flex-col py-4">
                  <Link href="/workouts/create">
                    <ActivitySquare className="mb-2 h-5 w-5" />
                    <span>New Workout</span>
                  </Link>
                </Button>
                <Button asChild className="h-auto flex-col py-4">
                  <Link href="/appointments/new">
                    <Calendar className="mb-2 h-5 w-5" />
                    <span>Schedule</span>
                  </Link>
                </Button>
                <Button asChild className="h-auto flex-col py-4">
                  <Link href="/analytics">
                    <TrendingUp className="mb-2 h-5 w-5" />
                    <span>Reports</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="border-primary/20 bg-card">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <div className="flex items-center">
                <BrainCircuit className="h-5 w-5 text-primary mr-2" />
                <CardTitle>AI Insights</CardTitle>
              </div>
              <CardDescription>
                Actionable insights from your client data
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {dummyInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${insight.type === 'progression' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {insight.type === 'progression' ? 'Progress' : 'Alert'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-2">Confidence</span>
                        <Progress value={insight.confidence * 100} className="h-2 w-20" />
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                <Link href="/ai-insights" className="flex items-center">
                  View All Insights
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Students Quick View */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Students</CardTitle>
                <CardDescription>
                  Quick view of your current clients
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/students">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarImage src="" alt={student.name} />
                        <AvatarFallback className="bg-primary/10">
                          {student.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Next: {student.nextSession}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/students/${student.id}`}>
                        <User size={16} />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}