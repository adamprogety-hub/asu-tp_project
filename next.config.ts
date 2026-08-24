import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal production server with only traced runtime dependencies.
  output: "standalone",

  // ─── Image Optimisation ───────────────────────────────────────────
  images: {
    // WebP is generated much faster on the CPU during cold starts, avoiding LCP delays
    formats: ["image/webp", "image/avif"],

    // Responsive breakpoints for srcSet generation
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],

    // Allowed quality values (must list every quality used in <Image quality={n}>)
    qualities: [75, 80, 85, 92],

    // Cache optimised images for 1 year
    minimumCacheTTL: 31536000,

    // Allow SVG (used for favicon and logo)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ─── Compression ─────────────────────────────────────────────────
  compress: true,

  // ─── Bundle optimisation ─────────────────────────────────────────
  // Tree-shakes lucide-react — only imports used icons
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },

};

export default nextConfig;
