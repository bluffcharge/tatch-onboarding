/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Tree-shake barrel imports at build time. Without this, `import { X }
    // from 'lucide-react'` pulls the whole icon manifest into the client
    // bundle on first load. This rewrites it to per-icon ESM paths, which
    // matters for this prototype because nearly every screen imports a
    // handful of icons (Auth, Discovery, BusinessProfile, Team, the
    // gallery chrome, the ticket frame, etc.).
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
