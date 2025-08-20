"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '../../../../../services/apiService';
import ChartComponent from '../../../../../components/ChartComponent';

export default function TemporalTrendsPage() {
  const router = useRouter();
           const params = useParams();
         const projectId = params?.projectId as string;
  
  const [projectData, setProjectData] = useState<{
    id: string;
    workspace_name: string;
    columns?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateColumn, setSelectedDateColumn] = useState('');
  const [selectedValueColumn, setSelectedValueColumn] = useState('');
  const [timeGranularity, setTimeGranularity] = useState('month');
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    temporal_data?: { [key: string]: number };
    trends?: { period: string; value: number; trend: string }[];
    seasonality?: { [key: string]: number };
  } | null>(null);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true);
        
        const response = await apiService.getWorkspaces();
        const project = response.workspaces.find((ws: { id: string; workspace_name: string }) => 
          ws.id === projectId || 
          ws.workspace_name === decodeURIComponent(projectId as string)
        );
        
        if (project) {
          setProjectData(project);
          // Auto-select date and value columns if available
          if (project.columns) {
            const dateColumns = project.columns.filter((col: string) => 
              col.toLowerCase().includes('date') || 
              col.toLowerCase().includes('time') ||
              col.toLowerCase().includes('data')
            );
            const numericColumns = project.columns.filter((col: string) => 
              col.toLowerCase().includes('sales') || 
              col.toLowerCase().includes('value') ||
              col.toLowerCase().includes('amount') ||
              col.toLowerCase().includes('total')
            );
            
            if (dateColumns.length > 0) setSelectedDateColumn(dateColumns[0]);
            if (numericColumns.length > 0) setSelectedValueColumn(numericColumns[0]);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do projeto:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const granularityOptions = [
    { id: 'day', name: 'Dia', icon: '📅' },
    { id: 'week', name: 'Semana', icon: '📆' },
    { id: 'month', name: 'Mês', icon: '📊' },
    { id: 'quarter', name: 'Trimestre', icon: '📈' },
    { id: 'year', name: 'Ano', icon: '📋' }
  ];

  const handleGenerateAnalysis = async () => {
    if (!selectedDateColumn || !selectedValueColumn) {
      alert('Selecione as colunas de data e valores para análise.');
      return;
    }

    try {
      setGeneratingAnalysis(true);
      console.log('Gerando análise temporal:', { projectId, selectedDateColumn, selectedValueColumn, timeGranularity });
      
      // Chamar o endpoint do backend
                   const response = await apiService.generateTemporalAnalysis(projectId, selectedDateColumn, selectedValueColumn, timeGranularity as string);
      console.log('✅ Análise temporal gerada:', response);
      
      // Atualizar o estado com os resultados
      setAnalysisResults(response);
      
      alert('Análise temporal gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
      alert('Erro ao gerar análise. Tente novamente.');
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando análise de tendências...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Sidebar */}
      <div className="fixed lg:relative z-50 h-full bg-gray-900 text-white w-64 flex-shrink-0 shadow-lg">
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              A
            </div>
            <span className="text-base font-semibold text-white truncate">
              AutoReport
            </span>
          </div>
        </div>
        
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-700 bg-gray-900">
          <button 
            onClick={() => router.push(`/dashboard/analysis/${projectId}`)}
            className="w-full h-9 lg:h-10 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm"
          >
            ← Voltar às Análises
          </button>
        </div>

        {/* Analysis Controls */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Configurações</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Coluna de Data</label>
              <select
                value={selectedDateColumn}
                onChange={(e) => setSelectedDateColumn(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-600"
              >
                <option value="">Selecione uma coluna de data</option>
                {projectData?.columns?.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Coluna de Valor</label>
              <select
                value={selectedValueColumn}
                onChange={(e) => setSelectedValueColumn(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-600"
              >
                <option value="">Selecione uma coluna de valor</option>
                {projectData?.columns?.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Granularidade</label>
              <select
                value={timeGranularity}
                onChange={(e) => setTimeGranularity(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-600"
              >
                {granularityOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.icon} {option.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateAnalysis}
              disabled={generatingAnalysis || !selectedDateColumn || !selectedValueColumn}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {generatingAnalysis ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <span>📈</span>
                  Gerar Tendências
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Análise de Tendências Temporais
                  </h1>
                  <p className="text-gray-600">
                    Identifique padrões e tendências ao longo do tempo
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    📊 Exportar Gráfico
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    💾 Salvar Análise
                  </button>
                </div>
              </div>

              {/* Project Info */}
              {projectData && (
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">📈</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {projectData.workspace_name || projectData.table_name}
                      </h3>
                      <p className="text-gray-600">
                        Analisando: <strong>{selectedValueColumn}</strong> ao longo de <strong>{selectedDateColumn}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Granularity Selection */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Granularidade Temporal</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {granularityOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setTimeGranularity(option.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      timeGranularity === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <h3 className="font-semibold text-gray-900">{option.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tendência Temporal - {selectedValueColumn}
                </h3>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    🔄 Atualizar
                  </button>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    ⚙️ Configurações
                  </button>
                </div>
              </div>

              {/* Chart Component */}
              <div className="h-96">
                {analysisResults ? (
                  <ChartComponent
                    type="line"
                    data={{
                      points: analysisResults.trend_data.map((item: { mean?: number; sum?: number; count?: number }, index: number) => ({
                        x: index,
                        y: item.mean || item.sum || item.count
                      }))
                    }}
                    height={384}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Clique em &quot;Gerar Análise&quot; para visualizar os dados</p>
                  </div>
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights Temporais</h3>
                <div className="space-y-3">
                  {analysisResults ? (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-lg">📈</div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Tendência Temporal</p>
                          <p className="text-xs text-blue-700">
                            {analysisResults.total_periods} períodos analisados com granularidade {analysisResults.granularity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-lg">📊</div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Análise de Valores</p>
                          <p className="text-xs text-green-700">
                            Analisando {analysisResults.value_column} ao longo do tempo
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="text-yellow-600 text-lg">📅</div>
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Período de Análise</p>
                          <p className="text-xs text-yellow-700">
                            Baseado na coluna {analysisResults.date_column}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-lg">📈</div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Tendência Crescente</p>
                          <p className="text-xs text-blue-700">Os valores mostram tendência de crescimento ao longo do tempo</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-lg">📊</div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Sazonalidade</p>
                          <p className="text-xs text-green-700">Padrões sazonais identificados nos dados</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="text-yellow-600 text-lg">⚠️</div>
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Outliers Temporais</p>
                          <p className="text-xs text-yellow-700">Alguns períodos apresentam valores atípicos</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Métricas Temporais</h3>
                <div className="space-y-3">
                  {analysisResults ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total de Períodos:</span>
                        <span className="font-medium">{analysisResults.total_periods}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Granularidade:</span>
                        <span className="font-medium">{analysisResults.granularity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coluna de Data:</span>
                        <span className="font-medium">{analysisResults.date_column}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coluna de Valores:</span>
                        <span className="font-medium">{analysisResults.value_column}</span>
                      </div>
                      {analysisResults.trend_data.length > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Média Geral:</span>
                            <span className="font-medium">
                              {(analysisResults.trend_data.reduce((sum: number, item: { mean?: number }) => sum + (item.mean || 0), 0) / analysisResults.trend_data.length).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Geral:</span>
                            <span className="font-medium">
                              {analysisResults.trend_data.reduce((sum: number, item: { sum?: number }) => sum + (item.sum || 0), 0).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total de Períodos:</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Granularidade:</span>
                        <span className="font-medium">Mensal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tendência:</span>
                        <span className="font-medium">Crescente</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Variação:</span>
                        <span className="font-medium">+15.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sazonalidade:</span>
                        <span className="font-medium">Detectada</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Outliers:</span>
                        <span className="font-medium">3 períodos</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Próximos Passos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/correlation_matrix`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🔍</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise de Correlação</h4>
                  <p className="text-sm text-gray-600">Descubra fatores que influenciam as tendências</p>
                </button>
                
                <button 
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/geographic_analysis`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🌍</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise Geográfica</h4>
                  <p className="text-sm text-gray-600">Compare tendências por região</p>
                </button>
                
                <button 
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/exploratory`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise Exploratória</h4>
                  <p className="text-sm text-gray-600">Explore outros aspectos dos dados</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
