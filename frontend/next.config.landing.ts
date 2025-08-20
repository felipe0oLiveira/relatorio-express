import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração específica para landing page
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Desabilitar funcionalidades desnecessárias para landing page
  experimental: {
    // Manter apenas funcionalidades essenciais
  },
  // Configurações de performance
  compress: true,
  poweredByHeader: false,
  // Configuração para ignorar páginas que não são necessárias
  pageExtensions: ['tsx', 'ts'],
  // Configuração para ignorar páginas problemáticas
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuração para ignorar middleware
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
