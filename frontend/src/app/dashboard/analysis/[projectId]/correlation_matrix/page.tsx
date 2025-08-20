"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '../../../../../services/apiService';
import ChartComponent from '../../../../../components/ChartComponent';

export default function CorrelationMatrixPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;

  const [projectData, setProjectData] = useState<{
    id: string;
    workspace_name: string;
    columns?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    correlation_matrix?: number[][];
    column_names?: string[];
    insights?: string[];
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
          // Selecionar automaticamente as primeiras colunas numéricas
          if (project.columns) {
            const numericColumns = project.columns.filter((col: string) =>
              col.toLowerCase().includes('sales') ||
              col.toLowerCase().includes('value') ||
              col.toLowerCase().includes('amount') ||
              col.toLowerCase().includes('total') ||
              col.toLowerCase().includes('price') ||
              col.toLowerCase().includes('quantity')
            );
            if (numericColumns.length >= 2) {
              setSelectedColumns(numericColumns.slice(0, 3));
            }
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

  const handleGenerateAnalysis = async () => {
    if (selectedColumns.length < 2) {
      alert('Selecione pelo menos duas colunas para análise de correlação.');
      return;
    }

    try {
      setGeneratingAnalysis(true);
      console.log('Gerando análise de correlação:', { projectId, selectedColumns });
      
      // Chamar o endpoint do backend
      const response = await apiService.generateCorrelationAnalysis(projectId, selectedColumns);
      console.log('✅ Análise de correlação gerada:', response);
      
      // Atualizar o estado com os resultados
      setAnalysisResults(response);
      
      alert('Análise de correlação gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
      alert('Erro ao gerar análise. Tente novamente.');
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando análise de correlação...</p>
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
              <label className="block text-xs text-gray-400 mb-1">Colunas para Análise</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {projectData?.columns?.map((col: string) => (
                  <label key={col} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col)}
                      onChange={() => handleColumnToggle(col)}
                      className="w-3 h-3 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                    />
                    <span className="truncate">{col}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateAnalysis}
              disabled={generatingAnalysis || selectedColumns.length < 2}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {generatingAnalysis ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <span>🔗</span>
                  Gerar Análise
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
                    Análise de Correlação
                  </h1>
                  <p className="text-gray-600">
                    Identifique relacionamentos entre variáveis nos seus dados
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    📊 Exportar Matriz
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
                    <div className="text-2xl">🔗</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {projectData.workspace_name || projectData.table_name}
                      </h3>
                      <p className="text-gray-600">
                        Analisando: <strong>{selectedColumns.join(', ')}</strong> • {projectData.row_count?.toLocaleString()} registros
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chart Area */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Matriz de Correlação - {selectedColumns.join(', ')}
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
                    type="heatmap"
                    data={{
                      matrix: analysisResults.correlation_matrix,
                      labels: selectedColumns
                    }}
                    height={384}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Clique em &quot;Gerar Análise&quot; para visualizar a matriz de correlação</p>
                  </div>
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights de Correlação</h3>
                <div className="space-y-3">
                  {analysisResults ? (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-lg">🔗</div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Correlações Fortes</p>
                          <p className="text-xs text-blue-700">
                            {analysisResults.strong_correlations.length} correlações fortes identificadas
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-lg">📊</div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Variáveis Analisadas</p>
                          <p className="text-xs text-green-700">
                            {analysisResults.total_variables} variáveis incluídas na análise
                          </p>
                        </div>
                      </div>

                      {analysisResults.strong_correlations.length > 0 && (
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="text-yellow-600 text-lg">⚠️</div>
                          <div>
                            <p className="text-sm font-medium text-yellow-900">Correlações Significativas</p>
                            <p className="text-xs text-yellow-700">
                              {analysisResults.strong_correlations.slice(0, 3).map((corr: { column1: string; column2: string; correlation: number }) => 
                                `${corr.column1} ↔ ${corr.column2} (${corr.correlation.toFixed(2)})`
                              ).join(', ')}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-lg">🔗</div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Correlações Positivas</p>
                          <p className="text-xs text-blue-700">Vendas e marketing mostram correlação forte</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-lg">📊</div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Correlações Negativas</p>
                          <p className="text-xs text-green-700">Preço e quantidade têm correlação inversa</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="text-yellow-600 text-lg">⚠️</div>
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Baixa Correlação</p>
                          <p className="text-xs text-yellow-700">Algumas variáveis não mostram relacionamento</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Métricas de Correlação</h3>
                <div className="space-y-3">
                  {analysisResults ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total de Variáveis:</span>
                        <span className="font-medium">{analysisResults.total_variables}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Correlações Fortes:</span>
                        <span className="font-medium">{analysisResults.strong_correlations.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Correlação Média:</span>
                        <span className="font-medium">
                          {(analysisResults.strong_correlations.reduce((sum: number, corr: { correlation: number }) => sum + Math.abs(corr.correlation), 0) / Math.max(analysisResults.strong_correlations.length, 1)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Correlação Máxima:</span>
                        <span className="font-medium">
                          {analysisResults.strong_correlations.length > 0 
                            ? Math.max(...analysisResults.strong_correlations.map((corr: { correlation: number }) => Math.abs(corr.correlation))).toFixed(2)
                            : '0.00'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Colunas Selecionadas:</span>
                        <span className="font-medium">{selectedColumns.length}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total de Variáveis:</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Correlações Fortes:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Correlação Média:</span>
                        <span className="font-medium">0.75</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Correlação Máxima:</span>
                        <span className="font-medium">0.92</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Significância:</span>
                        <span className="font-medium">Alta</span>
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
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/exploratory`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise Exploratória</h4>
                  <p className="text-sm text-gray-600">Explore padrões e distribuições</p>
                </button>

                <button
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/temporal_trends`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📈</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise Temporal</h4>
                  <p className="text-sm text-gray-600">Identifique tendências ao longo do tempo</p>
                </button>

                <button
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/geographic_analysis`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🌍</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise Geográfica</h4>
                  <p className="text-sm text-gray-600">Visualize dados por localização</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
