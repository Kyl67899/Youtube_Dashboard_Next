"use client"

import { useState } from "react";
import { Search, Plus, Bell, User, Menu, X } from "lucide-react";
import { Button } from "../../component/ui/button";
import { Input } from "../../component/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../component/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../component/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../component/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { NewProjectDialog } from "./NewProjectDialog";
import { Project, initialEntries } from "../data/initialEntries";

export function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [entries, setEntries] = useState<typeof Project[]>(initialEntries);

  const handleAddProject = (newProject: typeof Project) => {
    setEntries((prev) => [...prev, newProject]);
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary"></div>
          <span className="font-semibold">Dashboard</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Analytics
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Reports
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Team
          </Link>
        </nav>

        {/* Desktop Search, Actions, and User Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {/* Search Field - hidden on smaller screens */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="w-48 xl:w-64 pl-10"
            />
          </div>

          {/* Search Icon for medium screens */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* New Project Button */}
          <Button className="hidden sm:flex">
            <Plus className="h-4 w-4 mr-2" />
            <NewProjectDialog onAdd={handleAddProject} />
            {/* <span className="lg:hidden">New</span> */}
          </Button>

          {/* New Project Icon for small screens */}
          <Button size="icon" className="sm:hidden">
            <Plus className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-primary"></div>
                  Dashboard
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-10"
                  />
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-4">
                  <Link href="#" className="block text-foreground hover:text-primary transition-colors">
                    Projects
                  </Link>
                  <Link href="#" className="block text-foreground hover:text-primary transition-colors">
                    Analytics
                  </Link>
                  <Link href="#" className="block text-foreground hover:text-primary transition-colors">
                    Reports
                  </Link>
                  <Link href="#" className="block text-foreground hover:text-primary transition-colors">
                    Team
                  </Link>
                </nav>

                {/* Mobile Actions */}
                <div className="space-y-4 pt-4 border-t">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    <NewProjectDialog onAdd={handleAddProject} />
                  </Button>

                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>

                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}