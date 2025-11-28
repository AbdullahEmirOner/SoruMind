"use client";

import { Bell, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-sm-border bg-sm-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs or Page Title could go here */}
        <h1 className="text-lg font-semibold text-sm-text">Panel</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-sm-text-muted hover:text-sm-text">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-sm-text-muted hover:text-sm-text">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Tema değiştir</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-sm-border">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback className="bg-sm-surface-light text-sm-text">SM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-sm-surface border-sm-border text-sm-text" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Öğrenci</p>
                <p className="text-xs leading-none text-sm-text-muted">
                  ogrenci@sorumind.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-sm-border" />
            <DropdownMenuItem className="focus:bg-sm-surface-light focus:text-sm-text">
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-sm-surface-light focus:text-sm-text">
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-sm-border" />
            <DropdownMenuItem className="text-red-400 focus:bg-red-900/20 focus:text-red-400">
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
