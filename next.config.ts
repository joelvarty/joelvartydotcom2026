import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components (Next 16's Partial Prerendering model). Every Agility read
  // in src/lib/cms/ is wrapped in `"use cache"` + cacheTag + cacheLife("days")
  // and invalidated the moment Joel publishes, via /api/revalidate. Pages get a
  // static shell with any request-time parts streamed in. This replaces the old
  // `export const revalidate = 86400` on each route (those segment configs are
  // rejected under cacheComponents).
  cacheComponents: true,
  // Prefetch the static shell of a link's target and stream the rest, the
  // pairing Next recommends for new Cache Components apps (both become the
  // default in the next major).
  partialPrefetching: true,
  poweredByHeader: false,

  // Performance optimizations
  compress: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@agility/nextjs"],
  },

  async rewrites() {
    // *** Preview + deep links must survive a CDN cache hit. ***
    //
    // src/proxy.ts also handles ?agilitypreviewkey=, ?AgilityPreview=0 and
    // ?ContentID=, but Vercel does NOT invoke the proxy when it serves a
    // prerendered page straight from the edge cache, which under cacheComponents
    // is most pages. Without these rewrites, preview silently shows published
    // content. A `has`-matched `beforeFiles` rewrite is evaluated BEFORE the
    // cache lookup, so it always reaches the route handler.
    //
    // Both are kept on purpose: the proxy covers uncached requests, these cover
    // cached ones, and they converge on the same handlers. The (?!api) guard
    // keeps /api/preview itself from matching and looping. The incoming query
    // string is carried over, so agilitypreviewkey / lang / ContentID arrive.
    return {
      beforeFiles: [
        {
          source: "/:path((?!api).*)",
          has: [{ type: "query", key: "agilitypreviewkey" }],
          destination: "/api/preview?slug=/:path",
        },
        {
          source: "/:path((?!api).*)",
          // anchored: `has.value` is a regex, so a bare "0" would also match "10"
          has: [{ type: "query", key: "AgilityPreview", value: "^0$" }],
          destination: "/api/preview/exit?slug=/:path",
        },
        {
          source: "/:path((?!api).*)",
          has: [{ type: "query", key: "ContentID" }],
          // `slug` lets the handler fall back to the requested page when the
          // ContentID does not resolve to an item.
          destination: "/api/dynamic-redirect?slug=/:path",
        },
      ],
    };
  },

  // Security headers. CACHE headers are deliberately NOT here: they live in
  // src/proxy.ts, which can see the draft-mode cookie. A rule here is
  // unconditional and would put `public` CDN caching on draft renders.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://app.agilitycms.com",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
