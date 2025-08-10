"use client";

import { Upload, Brain, FileText, TrendingUp, Zap, CheckCircle } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Simples",
      description: "Arraste e solte seus dados em CSV, Excel ou JSON",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2
    },
    {
      icon: Brain,
      title: "IA Processa",
      description: "Nossa inteligência artificial analisa e identifica padrões",
      color: "from-purple-500 to-pink-500",
      delay: 0.4
    },
    {
      icon: FileText,
      title: "Relatório Pronto",
      description: "Receba insights profissionais em segundos",
      color: "from-green-500 to-emerald-500",
      delay: 0.6
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Análise Inteligente",
      description: "Identificação automática de tendências e anomalias"
    },
    {
      icon: Zap,
      title: "Processamento Rápido",
      description: "Resultados em segundos, não em horas"
    },
    {
      icon: CheckCircle,
      title: "Qualidade Garantida",
      description: "Relatórios com precisão de analista sênior"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600">
            Processo simples e inteligente para transformar seus dados em insights valiosos
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="relative mb-20">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 rounded-full hidden lg:block" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-gray-200 z-10">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full opacity-80`}></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-gray-700" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 