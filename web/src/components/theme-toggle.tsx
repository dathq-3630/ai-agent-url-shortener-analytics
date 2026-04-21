"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

function subscribe() {
  return () => {};
}

export function ThemeToggle() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <Button variant="outline" size="icon-sm" className="size-9" disabled aria-hidden />
    );
  }

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className="size-9"
      type="button"
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      aria-label={
        resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:inline" />
    </Button>
  );
}
