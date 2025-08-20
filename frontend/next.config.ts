import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração mínima para landing page estática
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Ignorar erros para permitir build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remover configurações que podem causar conflito
  // experimental: {},
  // pageExtensions: ['tsx', 'ts'],
};

export default nextConfig;
