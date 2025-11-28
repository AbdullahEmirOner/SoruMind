"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BrainCircuit,
  FileText,
  BookOpen,
  BarChart2,
  GraduationCap,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Panel", href: "/dashboard" },
  { icon: BrainCircuit, label: "Soru Tahmini", href: "/predict" },
  { icon: FileText, label: "Testler & Pratik", href: "/tests" },
  { icon: BookOpen, label: "Konular", href: "/topics" },
  { icon: BarChart2, label: "Analizler", href: "/analytics" },
  { icon: GraduationCap, label: "İstatistiklerim", href: "/statistics" },
  { icon: Settings, label: "Ayarlar", href: "/settings" },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sm-border bg-sm-surface/50 backdrop-blur-xl transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("flex h-16 items-center px-4 border-b border-sm-border", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-sm-accent to-purple-400 bg-clip-text text-transparent">
            SoruMind
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("text-sm-text-muted hover:text-sm-text", !isCollapsed && "ml-auto")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        <TooltipProvider>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group relative",
                      isActive
                        ? "bg-sm-surface-light text-sm-accent"
                        : "text-sm-text-muted hover:bg-sm-surface-light hover:text-sm-text hover:shadow-[0_0_15px_rgba(103,92,255,0.1)]",
                      isCollapsed && "justify-center"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-sm-accent rounded-r-full" />
                    )}
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-sm-accent" : "group-hover:text-sm-accent"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-sm-surface border-sm-border text-sm-text">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
