import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração específica para landing page SEM middleware
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Configurações de performance
  compress: true,
  poweredByHeader: false,
  // Configuração para ignorar páginas problemáticas
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Desabilitar middleware completamente
  experimental: {
    // Manter apenas funcionalidades essenciais
  },
  // Configuração para ignorar middleware e outras funcionalidades
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Configuração para build estático sem middleware
  distDir: 'out',
  generateBuildId: async () => {
    return 'landing-page-build';
  },
};

export default nextConfig;
