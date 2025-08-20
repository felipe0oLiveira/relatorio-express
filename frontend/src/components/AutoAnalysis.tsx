"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AutoAnalysisProps {
  data: any[];
  onClose: () => void;
}

interface AnalysisTemplate {
  id: string;
  title: string;
  description: string;
  type: 'kpi' | 'chart' | 'comparison';
  category: string;
  icon: string;
  color: string;
}

export default function AutoAnalysis({ data, onClose }: AutoAnalysisProps) {
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDashboard, setGeneratedDashboard] = useState<any>(null);

  // Templates de análise baseados no Zoho Analytics
  const analysisTemplates: AnalysisTemplate[] = [
    {
      id: 'units-sold',
      title: 'Units Sold Análise',
      description: 'Análise detalhada de unidades vendidas por região, método de venda e período',
      type: 'kpi',
      category: 'Vendas',
      icon: '📊',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'operating-profit',
      title: 'Operating Profit Análise',
      description: 'Análise de lucro operacional por produto, região e método de venda',
      type: 'kpi',
      category: 'Financeiro',
      icon: '💰',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'operating-margin',
      title: 'Operating Margin Análise',
      description: 'Análise de margem operacional e rentabilidade por segmento',
      type: 'kpi',
      category: 'Financeiro',
      icon: '📈',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'retailer-analysis',
      title: 'Retailer ID Análise',
      description: 'Análise de performance por varejista e distribuição geográfica',
      type: 'chart',
      category: 'Vendas',
      icon: '🏪',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'units-profit-comparison',
      title: 'Units Sold x Operating Profit',
      description: 'Comparação entre unidades vendidas e lucro operacional',
      type: 'comparison',
      category: 'Análise Comparativa',
      icon: '⚖️',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'regional-performance',
      title: 'Performance Regional',
      description: 'Análise de performance por região geográfica',
      type: 'chart',
      category: 'Geográfico',
      icon: '🌍',
      color: 'from-teal-500 to-green-600'
    }
  ];

  const handleAnalysisToggle = (analysisId: string) => {
    setSelectedAnalyses(prev => 
      prev.includes(analysisId) 
        ? prev.filter(id => id !== analysisId)
        : [...prev, analysisId]
    );
  };

  const generateDashboard = async () => {
    setIsGenerating(true);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Gerar dashboard baseado nas análises selecionadas
    const dashboard = {
      title: 'Dashboard Automático',
      analyses: selectedAnalyses.map(id => {
        const template = analysisTemplates.find(t => t.id === id);
        return {
          ...template,
          data: generateMockData(id, data)
        };
      })
    };
    
    setGeneratedDashboard(dashboard);
    setIsGenerating(false);
  };

  const generateMockData = (analysisId: string, rawData: any[]) => {
    // Gerar dados mock baseados no tipo de análise
    switch (analysisId) {
      case 'units-sold':
        return {
          totalUnits: rawData.reduce((sum, row) => sum + (row['Units Sold'] || 0), 0),
          byRegion: {
            'West': 687000,
            'Northeast': 550000,
            'South': 520000,
            'Southeast': 480000,
            'Midwest': 450000
          },
          byMethod: {
            'Online': 939000,
            'In-store': 850000,
            'Outlet': 800000
          }
        };
      case 'operating-profit':
        return {
          totalProfit: rawData.reduce((sum, row) => sum + (row['Operating Profit'] || 0), 0),
          byRegion: {
            'West': 89610000,
            'Northeast': 85000000,
            'South': 75000000,
            'Southeast': 65000000,
            'Midwest': 60000000
          },
          byMethod: {
            'In-store': 127590000,
            'Outlet': 107990000,
            'Online': 96560000
          }
        };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Análise Automática</h1>
            <span className="text-sm text-gray-500">
              {selectedAnalyses.length} análises selecionadas
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!generatedDashboard ? (
          <>
            {/* Seleção de Análises */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Selecione as análises que deseja gerar:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      selectedAnalyses.includes(template.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => handleAnalysisToggle(template.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center text-white text-xl`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {template.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {template.description}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                          {template.category}
                        </span>
                      </div>
                      {selectedAnalyses.includes(template.id) && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Botão Gerar Dashboard */}
            <div className="text-center">
              <button
                onClick={generateDashboard}
                disabled={selectedAnalyses.length === 0 || isGenerating}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Gerando Dashboard...</span>
                  </div>
                ) : (
                  `Gerar Dashboard (${selectedAnalyses.length} análises)`
                )}
              </button>
            </div>
          </>
        ) : (
          /* Dashboard Gerado */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {generatedDashboard.title}
              </h2>
              <button
                onClick={() => setGeneratedDashboard(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Gerar Novo Dashboard
              </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {generatedDashboard.analyses.map((analysis: any) => (
                <div key={analysis.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${analysis.color} flex items-center justify-center text-white`}>
                      {analysis.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{analysis.title}</h3>
                      <p className="text-sm text-gray-500">{analysis.category}</p>
                    </div>
                  </div>
                  
                  {/* Dados específicos da análise */}
                  {analysis.id === 'units-sold' && (
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {analysis.data.totalUnits.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Total Units Sold</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="font-medium">Top Region</div>
                          <div className="text-gray-600">West: {analysis.data.byRegion.West.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium">Top Method</div>
                          <div className="text-gray-600">Online: {analysis.data.byMethod.Online.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {analysis.id === 'operating-profit' && (
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ${(analysis.data.totalProfit / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-sm text-gray-500">Total Operating Profit</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="font-medium">Top Region</div>
                          <div className="text-gray-600">West: ${(analysis.data.byRegion.West / 1000000).toFixed(2)}M</div>
                        </div>
                        <div>
                          <div className="font-medium">Top Method</div>
                          <div className="text-gray-600">In-store: ${(analysis.data.byMethod['In-store'] / 1000000).toFixed(2)}M</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {generatedDashboard.analyses.map((analysis: any) => (
                <div key={`chart-${analysis.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">{analysis.title} - Gráfico</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">📊</div>
                      <div>Gráfico interativo</div>
                      <div className="text-sm">(Integração com Chart.js)</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






