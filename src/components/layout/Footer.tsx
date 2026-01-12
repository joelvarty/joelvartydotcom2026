import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="hover:text-foreground transition-colors">
                    Career
                  </Link>
                </li>
                <li>
                  <Link href="/uses" className="hover:text-foreground transition-colors">
                    Uses
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/joelvarty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/joelvarty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Content</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog/rss.xml" className="hover:text-foreground transition-colors">
                    RSS Feed
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Built with{" "}
                <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 underline transition-colors">Next.js</a>,{" "}
                <a href="https://agilitycms.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 underline transition-colors">Agility CMS</a>, and AI assistance from{" "}
                <a href="https://cursor.com/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 underline transition-colors">Cursor</a>,{" "}
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 underline transition-colors">Claude</a>, and{" "}
                <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 underline transition-colors">GitHub Copilot</a>.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Joel Varty. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

