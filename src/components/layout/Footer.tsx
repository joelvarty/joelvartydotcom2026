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
                    className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/joelvarty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Subscribe</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog/rss.xml" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <circle cx="3.429" cy="20.571" r="3.429" />
                      <path d="M11.429 24h4.57C15.999 15.179 8.821 8.001 0 8.001v4.57c6.302 0 11.429 5.126 11.429 11.429z" />
                      <path d="M19.999 24H24C24 10.766 13.234 0 0 0v4.001c11.028 0 19.999 8.971 19.999 19.999z" />
                    </svg>
                    RSS Feed
                  </Link>
                </li>
                <li>
                  <Link href="https://joelvarty.substack.com/subscribe" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                    </svg>
                    Substack
                  </Link>
                </li>
              </ul>
            </div>




            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Built with{" "}
                <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 underline transition-colors inline-flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.251 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158a338.1 338.1 0 0 1-1.955-2.62l-1.919-2.592-2.404-3.558a341.4 341.4 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.009 3.516-.052 3.596a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.44.44 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.073-.091a.637.637 0 0 1 .174-.143c.096-.047.134-.051.534-.051.469 0 .554.018.67.12a527 527 0 0 1 2.586 3.868c1.428 2.139 3.4 5.09 4.382 6.559l1.786 2.67.091-.058a12.3 12.3 0 0 0 2.465-2.163 11.94 11.94 0 0 0 2.824-6.069c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.86-8.292-8.208-9.695a12.6 12.6 0 0 0-2.499-.523A21 21 0 0 0 11.572 0m4.069 7.217c.347 0 .408.005.486.047a.47.47 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.009-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054" /></svg>Next.js</a>,{" "}
                <a href="https://agilitycms.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 underline transition-colors inline-flex items-center gap-1"><svg width="12" height="11" viewBox="0 0 74 64" aria-hidden="true"><path d="M43.064 53.463H17.419l19.33-33.39 19.33 33.39 5.638 9.948h11.64L36.748.177.14 63.411h47.417z" fill="#ffcb28" /></svg>Agility CMS</a>, and AI assistance from our <a href="https://mcp.agilitycms.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 underline transition-colors">MCP server</a>{" "}
                and <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 underline transition-colors inline-flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 1200 1200" aria-hidden="true"><path d="M233.96 800.21L468.64 668.54l3.95-11.44-3.95-6.36h-11.44l-39.22-2.42-134.09-3.62-116.3-4.83-112.67-6.04L26.58 627.79 0 592.75l2.74-17.48 23.84-16.03 34.15 2.98 75.46 5.15 113.24 7.81 82.15 4.83 121.69 12.65h19.33l2.74-7.81-6.6-4.83-5.16-4.83L346.39 495.79 219.54 411.87l-66.44-48.32-35.92-24.48-18.12-22.95-7.81-50.1 32.62-35.92 43.81 2.98 11.19 2.98 44.38 34.15 94.79 73.37 123.79 91.17 18.12 15.06 7.25-5.15.89-3.63-8.14-13.61-67.46-121.69-71.84-123.79-31.97-51.3-8.46-30.77c-2.98-12.64-5.15-23.27-5.15-36.24l37.13-50.42 20.54-6.6 49.53 6.6 20.86 18.12 30.77 70.39 49.85 110.82 77.32 150.68 22.63 44.7 12.08 41.4 4.51 12.64h7.81v-7.25l6.36-84.89 11.76-104.21 11.44-134.09 3.95-37.77 18.68-45.26 37.13-24.48 28.99 13.85 23.84 34.15-3.3 22.07-14.17 92.13-27.79 144.32-18.12 96.64h10.55l12.08-12.08 48.89-64.91 82.15-102.68 36.24-40.75 42.28-45.02 27.14-21.42h51.3l37.77 56.13-16.91 57.99-52.83 67-43.81 56.78-62.82 84.56-39.22 67.65 3.63 5.4 9.34-0.89 141.91-30.2 76.67-13.85 91.49-15.7 41.4 19.33 4.51 19.65-16.27 40.19-97.85 24.16-114.77 22.95-170.9 40.43-2.09 1.53 2.42 2.98 76.99 7.25 32.94 1.77 80.62 0 150.12 11.19 39.22 25.93 23.52 31.73-3.95 24.16-60.4 30.77-81.5-19.33-190.23-45.26-65.24-16.27-9.02 0v5.4l54.36 53.15 99.62 89.96 124.75 115.97 6.36 28.67-16.03 22.63-16.91-2.42-109.61-82.47-42.28-37.13-95.76-80.62h-5.66v8.46l22.07 32.3 116.54 175.17 6.04 53.72-8.46 17.48-30.2 10.55-33.18-6.04-68.21-95.76-70.39-107.84-56.78-96.64-6.93 3.95-33.5 360.89-15.7 18.44-36.24 13.85-30.2-22.95-16.03-37.13 16.03-73.37 19.33-95.76 15.7-76.11 14.17-94.55 8.46-31.41-.56-2.09-6.93.89-71.23 97.85-108.4 146.5-85.77 91.81-20.54 8.14-35.6-18.44 3.3-36.94 19.93-29.31 118.63-150.7 71.6-93.58 46.23-52.83-.32-7.81-2.74 0L205.29 929.4l-56.13 7.25-24.16-22.63 2.98-37.13 11.44-12.08 94.79-65.23-.32.32z" fill="#D97757"/></svg>Claude</a>.
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

