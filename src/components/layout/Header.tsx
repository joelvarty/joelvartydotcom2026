import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              Joel Varty
            </Link>
          </div>
          <div className="hidden md:block">
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}

