"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export interface ThemeTogglerButtonProps {
  variant?: "default" | "ghost";
  size?: "sm" | "md" | "lg";
  direction?: "horizontal" | "vertical";
  modes?: ("light" | "dark" | "system")[];
  onClick?: (e: React.MouseEvent) => void;
}

export function ThemeTogglerButton({
  variant = "default",
  size = "md",
  direction = "horizontal",
  modes = ["light", "dark"],
  onClick,
}: ThemeTogglerButtonProps) {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";
  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" && modes.includes("system")
      ? "system"
      : "light";

  const handleToggle = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else {
      setTheme(nextTheme as any);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative flex items-center justify-center rounded-md border p-2 transition-colors",
        variant === "ghost" && "border-transparent hover:bg-accent",
        size === "sm" && "h-8 w-8",
        size === "md" && "h-10 w-10",
        size === "lg" && "h-12 w-12"
      )}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-primary" />
        ) : (
          <Sun className="h-5 w-5 text-primary" />
        )}
      </motion.div>
    </button>
  );
}
