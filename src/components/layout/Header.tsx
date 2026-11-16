import Link from "next/link";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { SOCIAL_PROFILES } from "@/config/social";
import { SocialIcon } from "./SocialIcon";

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors focus-ring"
            >
              Joel Varty
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Navigation />
            </div>
            {/* the channels being promoted (src/config/social.ts, header: true) */}
            <ul className="hidden sm:flex items-center" aria-label="Joel on social media">
              {SOCIAL_PROFILES.filter((p) => p.header).map((profile) => (
                <li key={profile.network}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    aria-label={`${profile.name} (${profile.handle})`}
                    title={`${profile.name} ${profile.handle}`}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors focus-ring"
                  >
                    <SocialIcon network={profile.network} size={18} />
                  </a>
                </li>
              ))}
            </ul>
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

