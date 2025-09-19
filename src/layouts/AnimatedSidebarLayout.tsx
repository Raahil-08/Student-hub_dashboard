"use client";
import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import {
  IconDashboard,
  IconUpload,
  IconTrophy,
  IconFileText,
  IconSettings,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeAnimatedToggle } from "@/components/ThemeAnimatedToggle";
import { NotificationPanel } from "@/components/NotificationPanel";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnimatedSidebarLayout() {
  const location = useLocation();
  
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: IconDashboard,
    },
    {
      label: "Upload Achievement",
      href: "/upload",
      icon: IconUpload,
    },
    {
      label: "My Achievements",
      href: "/achievements",
      icon: IconTrophy,
    },
    {
      label: "Upcoming Events",
      href: "/events",
      icon: IconSettings,
    },
    {
      label: "Portfolio",
      href: "/portfolio",
      icon: IconFileText,
    },
  ];
  
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex w-full h-screen bg-background">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <NavLink
                  key={idx}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-start gap-2 group/sidebar py-2 px-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <link.icon className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-primary-foreground" : "text-foreground"
                      )} />
                      <motion.span
                        animate={{
                          display: open ? "inline-block" : "none",
                          opacity: open ? 1 : 0,
                        }}
                        className="text-sm transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                      >
                        {link.label}
                      </motion.span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <NavLink
              to="/portfolio"
              className="flex items-center justify-start gap-2 group/sidebar py-2 px-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <div className="h-7 w-7 shrink-0 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">SJ</span>
              </div>
              <motion.div
                animate={{
                  display: open ? "block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-left"
              >
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </motion.div>
            </NavLink>
          </div>
        </SidebarBody>
      </Sidebar>
      
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <nav className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-foreground">Student Hub</h1>
          
          <div className="flex items-center gap-4">
            <ThemeAnimatedToggle variant="ghost" size="md" />
            <NotificationPanel />
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-foreground"
      >
        Student Hub
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
    </div>
  );
};