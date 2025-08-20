import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações otimizadas para landing page
  output: 'export', // Para deploy estático
  trailingSlash: true,
  images: {
    unoptimized: true, // Necessário para export estático
  },
  // Desabilitar funcionalidades que não são necessárias para landing page
  experimental: {
    // Manter apenas funcionalidades essenciais
  },
  // Configurações de performance
  compress: true,
  poweredByHeader: false,
  // Configuração para ignorar erros de TypeScript no build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configurações de segurança (removidas para export estático)
  // headers não funcionam com output: export
};

export default nextConfig;
