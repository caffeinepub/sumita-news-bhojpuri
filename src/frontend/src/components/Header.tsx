import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsCallerAdmin } from "../hooks/useQueries";

export function Header() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary">
            सुमिता न्यूज़ भोजपुरी
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="थीम बदलें"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">थीम बदलें</span>
          </Button>

          {isAdmin && (
            <>
              {/* Desktop Admin Button - Full text */}
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate({ to: "/admin" })}
                className="hidden md:flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                एडमिन पैनल
              </Button>
              
              {/* Mobile Admin Icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: "/admin" })}
                title="एडमिन पैनल"
                className="md:hidden"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">एडमिन पैनल</span>
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">मेन्यू</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate({ to: "/" })}>
                होम
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                    एडमिन पैनल
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin/create" })}>
                    नया लेख बनाएं
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
