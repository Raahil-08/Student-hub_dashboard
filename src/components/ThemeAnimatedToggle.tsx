"use client";

import { useEffect, useRef } from "react";
import {
  ThemeTogglerButton,
  type ThemeTogglerButtonProps,
} from "@/components/animate-ui/components/buttons/theme-toggler";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeAnimatedToggleProps {
  variant?: ThemeTogglerButtonProps["variant"];
  size?: ThemeTogglerButtonProps["size"];
  direction?: ThemeTogglerButtonProps["direction"];
  system?: boolean;
  className?: string;
}

export function ThemeAnimatedToggle({
  variant = "default",
  size = "md",
  direction = "horizontal",
  system = true,
  className,
}: ThemeAnimatedToggleProps) {
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    // 🔄 cycle themes manually when button is clicked
    let newTheme: "light" | "dark" | "system";
    if (theme === "light") newTheme = "dark";
    else if (theme === "dark") newTheme = system ? "system" : "light";
    else newTheme = "light";

    setTheme(newTheme);
  };

  return (
    <div onClick={handleToggle} className={cn("cursor-pointer", className)}>
      <ThemeTogglerButton
        variant={variant}
        size={size}
        direction={direction}
        modes={system ? ["light", "dark", "system"] : ["light", "dark"]}
        onClick={(e) => e.preventDefault()} // Prevent double handling
      />
    </div>
  );
}
