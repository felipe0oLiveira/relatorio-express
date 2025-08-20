"use client";

import React from 'react';

// Tipos de gráficos disponíveis
export type ChartType = 
  | 'bar'           // Gráfico de barras - comparação entre categorias
  | 'line'          // Gráfico de linha - tendências temporais
  | 'pie'           // Gráfico de pizza - proporções
  | 'scatter'       // Gráfico de dispersão - correlações
  | 'histogram'     // Histograma - distribuição de dados
  | 'area'          // Gráfico de área - volume ao longo do tempo
  | 'column'        // Gráfico de colunas - dados categóricos
  | 'heatmap';      // Mapa de calor - correlações múltiplas

interface ChartSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  disabled?: boolean;
}

const chartTypes = [
  {
    type: 'bar' as ChartType,
    name: 'Barras',
    icon: '📊',
    description: 'Comparação entre categorias',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    selectedColor: 'bg-blue-100 border-blue-400'
  },
  {
    type: 'line' as ChartType,
    name: 'Linha',
    icon: '📈',
    description: 'Tendências temporais',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    selectedColor: 'bg-green-100 border-green-400'
  },
  {
    type: 'pie' as ChartType,
    name: 'Pizza',
    icon: '🥧',
    description: 'Proporções e percentuais',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    selectedColor: 'bg-purple-100 border-purple-400'
  },
  {
    type: 'scatter' as ChartType,
    name: 'Dispersão',
    icon: '🔍',
    description: 'Correlações entre variáveis',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    selectedColor: 'bg-orange-100 border-orange-400'
  },
  {
    type: 'histogram' as ChartType,
    name: 'Histograma',
    icon: '📊',
    description: 'Distribuição de dados',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    selectedColor: 'bg-red-100 border-red-400'
  },
  {
    type: 'area' as ChartType,
    name: 'Área',
    icon: '📊',
    description: 'Volume ao longo do tempo',
    color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
    selectedColor: 'bg-cyan-100 border-cyan-400'
  },
  {
    type: 'column' as ChartType,
    name: 'Colunas',
    icon: '📊',
    description: 'Dados categóricos',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    selectedColor: 'bg-yellow-100 border-yellow-400'
  },
  {
    type: 'heatmap' as ChartType,
    name: 'Mapa de Calor',
    icon: '🔥',
    description: 'Correlações múltiplas',
    color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    selectedColor: 'bg-pink-100 border-pink-400'
  }
];

export default function ChartSelector({ 
  selectedType, 
  onTypeChange, 
  disabled = false 
}: ChartSelectorProps) {
  return (
    <div className="chart-selector">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Selecionar Tipo de Gráfico ({chartTypes.length} tipos disponíveis)
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        {chartTypes.map((chart) => (
          <button
            key={chart.type}
            onClick={() => {
              if (!disabled) {
                console.log('Selecionando gráfico:', chart.type);
                onTypeChange(chart.type);
              }
            }}
            disabled={disabled}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${selectedType === chart.type 
                ? chart.selectedColor + ' shadow-md' 
                : chart.color + ' hover:shadow-sm'
              }
            `}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{chart.icon}</div>
              <div className="font-medium text-gray-900 text-sm">
                {chart.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {chart.description}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>💡 Dica:</strong> Escolha o tipo de gráfico que melhor representa seus dados. 
          Barras para comparações, linhas para tendências, pizza para proporções, etc.
        </p>
      </div>
    </div>
  );
}
