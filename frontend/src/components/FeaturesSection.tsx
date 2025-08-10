"use client";

import { ArrowRight, TrendingUp, Users2, Building, BarChart3 } from "lucide-react";

export default function FeaturesSection() {
  const useCases = [
    {
      icon: TrendingUp,
      title: "Relatórios Financeiros",
      description: "Análise de receitas, despesas, lucros e métricas financeiras em tempo real.",
      features: ["Análise de Receitas", "Controle de Despesas", "Métricas de Lucro", "Previsões Financeiras"]
    },
    {
      icon: BarChart3,
      title: "Análise de Marketing",
      description: "Transforme dados de campanhas em insights acionáveis para otimizar ROI.",
      features: ["Performance de Campanhas", "Análise de Audiência", "ROI por Canal", "Métricas de Conversão"]
    },
    {
      icon: Users2,
      title: "Relatórios de RH",
      description: "Análise de produtividade, engajamento e métricas de recursos humanos.",
      features: ["Produtividade de Equipes", "Análise de Turnover", "Engajamento", "Performance Individual"]
    },
    {
      icon: Building,
      title: "Business Intelligence",
      description: "Dashboards executivos e relatórios estratégicos para tomada de decisão.",
      features: ["Dashboards Executivos", "Análise Competitiva", "Previsões de Mercado", "Relatórios Estratégicos"]
    }
  ];

  const keyFeatures = [
    "IA Avançada para Análise Automática",
    "Relatórios Profissionais Instantâneos",
    "Integração com Múltiplas Fontes de Dados",
    "Dashboards Interativos Personalizáveis",
    "Segurança e Compliance Empresarial"
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            Casos de Uso
          </h2>
          <p className="text-xl text-gray-600">
            O AutoReport se adapta a diferentes necessidades de negócio, fornecendo insights personalizados para cada área da sua empresa.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {useCases.map((useCase, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <useCase.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Features Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Transforme Dados em Insights Valiosos
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nossa plataforma utiliza inteligência artificial avançada para analisar seus dados 
                e gerar relatórios profissionais automaticamente. Economize tempo e tome decisões 
                baseadas em dados reais.
              </p>
            </div>
            
            {/* Key Features List */}
            <ul className="space-y-4">
              {keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <ArrowRight className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right Placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-lg text-gray-600">Análise Inteligente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}