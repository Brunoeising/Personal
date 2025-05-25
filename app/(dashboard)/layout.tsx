"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DumbbellIcon as DumbellIcon, Home, Users, Dumbbell, Calendar, BarChart2, Settings, Menu, LogOut, X, Moon, Sun, UserRound, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useSupabase } from "@/lib/providers/supabase-provider";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, label, isActive, isCollapsed, onClick }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center p-3 rounded-md transition-colors ${
      isActive 
        ? "bg-primary/10 text-primary" 
        : "hover:bg-muted"
    }`}
    onClick={onClick}
  >
    <div className="mr-3">{icon}</div>
    {!isCollapsed && <span>{label}</span>}
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { supabase, user, loading } = useSupabase();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setUserName(user.user_metadata.full_name || user.email?.split("@")[0] || "User");
    }
  }, [user, loading, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderNavItems = (onClick?: () => void) => (
    <>
      <NavItem 
        href="/dashboard" 
        icon={<Home size={22} />} 
        label="Dashboard" 
        isActive={pathname === "/dashboard"} 
        isCollapsed={sidebarCollapsed}
        onClick={onClick}
      />
      <NavItem 
        href="/students" 
        icon={<Users size={22} />} 
        label="Students" 
        isActive={pathname?.startsWith("/students")} 
        isCollapsed={sidebarCollapsed}
        onClick={onClick}
      />
      <NavItem 
        href="/workouts" 
        icon={<Dumbbell size={22} />} 
        label="Workouts" 
        isActive={pathname?.startsWith("/workouts")} 
        isCollapsed={sidebarCollapsed}
        onClick={onClick}
      />
      <NavItem 
        href="/exercises" 
        icon={<Dumbbell size={22} />} 
        label="Exercises" 
        isActive={pathname?.startsWith("/exercises")} 
        isCollapsed={sidebarCollapsed}
        onClick={onClick}
      />
      <NavItem 
        href="/appointments" 
        icon={<Calendar size={22} />} 
        label="Appointments" 
        isActive={pathname?.startsWith("/appointments")} 
        isCollapsed={sidebarCollapsed}
        onClick={onClick}
      />
      <NavItem 
        href="/messages" 
        icon={<MessageSquare size={22} />} 
        label="Messages" 
        isActive={pathname?.startsWith("/messages")} 
        isCollapsed={sidebarCollapsed}
        onClick={onClick}
      />
      <NavItem 
        href="/analytics" 
        icon={<BarChart2 size={22} />} 
        label="Analytics" 
        isActive={pathname?.startsWith("/analytics")} 
        isCollapsed={sidebarCollapsed}
        onClick={onClick}
      />
      <NavItem 
        href="/settings" 
        icon={<Settings size={22} />} 
        label="Settings" 
        isActive={pathname?.startsWith("/settings")} 
        isCollapsed={sidebarCollapsed}
        onClick={onClick}
      />
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="bg-background border-b border-border sticky top-0 z-50 lg:hidden">
        <div className="container mx-auto py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mr-2"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
            <Link href="/dashboard" className="flex items-center">
              <DumbellIcon size={24} className="text-primary mr-2" />
              <span className="font-bold">FitPro</span>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun size={16} className="mr-2" />
                ) : (
                  <Moon size={16} className="mr-2" />
                )}
                Switch Theme
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut size={16} className="mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile sidebar (overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="absolute inset-y-0 left-0 w-64 bg-background border-r border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center">
                <DumbellIcon size={24} className="text-primary mr-2" />
                <span className="font-bold">FitPro</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-5rem)] py-2">
              <div className="px-2 space-y-1">
                {renderNavItems(() => setMobileMenuOpen(false))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-sm text-muted-foreground">Personal Trainer</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside 
          className={`hidden lg:block border-r border-border bg-card h-screen sticky top-0 transition-all duration-300 ${
            sidebarCollapsed ? "w-[4.5rem]" : "w-64"
          }`}
        >
          <div className={`p-4 border-b border-border flex ${sidebarCollapsed ? "justify-center" : "justify-between"} items-center`}>
            {!sidebarCollapsed && (
              <div className="flex items-center">
                <DumbellIcon size={24} className="text-primary mr-2" />
                <span className="font-bold">FitPro</span>
              </div>
            )}
            {sidebarCollapsed && (
              <DumbellIcon size={24} className="text-primary" />
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={sidebarCollapsed ? "ml-0" : ""}
            >
              <Menu size={18} />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-16rem)] py-2">
            <div className="px-2 space-y-1">
              {renderNavItems()}
            </div>
          </ScrollArea>
          <div className={`p-4 border-t border-border ${sidebarCollapsed ? "text-center" : ""}`}>
            {!sidebarCollapsed ? (
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="\" alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="font-medium truncate">{userName}</p>
                  <p className="text-sm text-muted-foreground">Trainer</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="flex-1"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                className="flex-1 text-destructive"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}