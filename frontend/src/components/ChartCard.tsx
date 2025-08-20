'use client';

import { useState } from 'react';
import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  onChartTypeChange?: (chartType: string) => void;
  currentChartType?: string;
}

const chartTypes = [
  { 
    id: 'bar', 
    name: 'Barras', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    id: 'line', 
    name: 'Linha', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    )
  },
  { 
    id: 'area', 
    name: 'Área', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    )
  },
  { 
    id: 'pie', 
    name: 'Pizza', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    )
  },
  { 
    id: 'scatter', 
    name: 'Dispersão', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="6" cy="6" r="2" fill="currentColor" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="18" cy="18" r="2" fill="currentColor" />
        <circle cx="8" cy="16" r="2" fill="currentColor" />
        <circle cx="16" cy="8" r="2" fill="currentColor" />
      </svg>
    )
  },
  { 
    id: 'histogram', 
    name: 'Histograma', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="8" width="3" height="8" fill="currentColor" />
        <rect x="8" y="6" width="3" height="10" fill="currentColor" />
        <rect x="13" y="4" width="3" height="12" fill="currentColor" />
        <rect x="18" y="10" width="3" height="6" fill="currentColor" />
        <rect x="23" y="12" width="3" height="4" fill="currentColor" />
      </svg>
    )
  },
  { 
    id: 'column', 
    name: 'Colunas', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="4" width="6" height="16" rx="1" stroke="currentColor" strokeWidth={2} fill="none" />
        <rect x="11" y="4" width="6" height="16" rx="1" stroke="currentColor" strokeWidth={2} fill="none" />
        <rect x="19" y="4" width="6" height="16" rx="1" stroke="currentColor" strokeWidth={2} fill="none" />
      </svg>
    )
  },
  { 
    id: 'heatmap', 
    name: 'Mapa de Calor', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="4" height="4" fill="currentColor" opacity="0.2" />
        <rect x="9" y="3" width="4" height="4" fill="currentColor" opacity="0.4" />
        <rect x="15" y="3" width="4" height="4" fill="currentColor" opacity="0.6" />
        <rect x="3" y="9" width="4" height="4" fill="currentColor" opacity="0.4" />
        <rect x="9" y="9" width="4" height="4" fill="currentColor" opacity="0.6" />
        <rect x="15" y="9" width="4" height="4" fill="currentColor" opacity="0.8" />
        <rect x="3" y="15" width="4" height="4" fill="currentColor" opacity="0.6" />
        <rect x="9" y="15" width="4" height="4" fill="currentColor" opacity="0.8" />
        <rect x="15" y="15" width="4" height="4" fill="currentColor" opacity="1" />
      </svg>
    )
  }
];

export default function ChartCard({ title, children, onChartTypeChange, currentChartType = 'bar' }: ChartCardProps) {
  const [showChartSelector, setShowChartSelector] = useState(false);

  const handleChartTypeSelect = (chartType: string) => {
    console.log('🔄 ChartCard: Mudando tipo para:', chartType);
    onChartTypeChange?.(chartType);
    setShowChartSelector(false);
  };

  return (
    <div 
      className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl p-6 relative group shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setShowChartSelector(true)}
      onMouseLeave={() => setShowChartSelector(false)}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
      
      {/* Header com título e seletor de gráfico */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{title}</h3>
        
        {/* Botão de mudança de tipo de gráfico */}
        <div className="relative">
          <button
            className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 opacity-0 group-hover:opacity-100 transform hover:scale-105"
            onClick={() => setShowChartSelector(!showChartSelector)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a2 2 0 002 2h4a2 2 0 002-2V5z" />
            </svg>
          </button>

          {/* Seletor de tipos de gráfico */}
          {showChartSelector && (
            <div className="absolute top-full right-0 mt-2 border border-gray-200 rounded-xl shadow-xl p-4 z-50 min-w-[280px] backdrop-blur-sm bg-white/95">
              <div className="text-sm font-medium mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Escolher tipo de gráfico ({chartTypes.length} tipos disponíveis)
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {chartTypes.map((chartType) => (
                  <button
                    key={chartType.id}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      currentChartType === chartType.id 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => handleChartTypeSelect(chartType.id)}
                    title={chartType.name}
                  >
                    <div className={`flex justify-center mb-1 transition-colors duration-200 ${
                      currentChartType === chartType.id ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {chartType.icon}
                    </div>
                    <div className={`text-xs truncate transition-colors duration-200 ${
                      currentChartType === chartType.id ? 'text-blue-700 font-medium' : 'text-gray-600'
                    }`}>{chartType.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo do gráfico */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
