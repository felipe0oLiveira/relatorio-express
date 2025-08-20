"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '../../../../../services/apiService';
import ChartComponent from '../../../../../components/ChartComponent';

export default function GeographicAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;

  const [projectData, setProjectData] = useState<{
    id: string;
    workspace_name: string;
    columns?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocationColumn, setSelectedLocationColumn] = useState('');
  const [selectedValueColumn, setSelectedValueColumn] = useState('');
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    geographic_data?: { [key: string]: number };
    top_locations?: { location: string; value: number }[];
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
          // Selecionar automaticamente colunas de localização e valores
          if (project.columns) {
            const locationColumns = project.columns.filter((col: string) =>
              col.toLowerCase().includes('country') ||
              col.toLowerCase().includes('pais') ||
              col.toLowerCase().includes('state') ||
              col.toLowerCase().includes('estado') ||
              col.toLowerCase().includes('city') ||
              col.toLowerCase().includes('cidade') ||
              col.toLowerCase().includes('region') ||
              col.toLowerCase().includes('regiao') ||
              col.toLowerCase().includes('location') ||
              col.toLowerCase().includes('localizacao')
            );
            const valueColumns = project.columns.filter((col: string) =>
              col.toLowerCase().includes('sales') ||
              col.toLowerCase().includes('value') ||
              col.toLowerCase().includes('amount') ||
              col.toLowerCase().includes('total') ||
              col.toLowerCase().includes('revenue') ||
              col.toLowerCase().includes('receita')
            );
            if (locationColumns.length > 0) setSelectedLocationColumn(locationColumns[0]);
            if (valueColumns.length > 0) setSelectedValueColumn(valueColumns[0]);
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
    if (!selectedLocationColumn) {
      alert('Selecione uma coluna de localização para análise.');
      return;
    }

    try {
      setGeneratingAnalysis(true);
      console.log('Gerando análise geográfica:', { projectId, selectedLocationColumn, selectedValueColumn });
      
      // Chamar o endpoint do backend
      const response = await apiService.generateGeographicAnalysis(projectId, selectedLocationColumn, selectedValueColumn);
      console.log('✅ Análise geográfica gerada:', response);
      
      // Atualizar o estado com os resultados
      setAnalysisResults(response);
      
      alert('Análise geográfica gerada com sucesso!');
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
            <p className="text-gray-600">Carregando análise geográfica...</p>
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
              <label className="block text-xs text-gray-400 mb-1">Coluna de Localização</label>
              <select
                value={selectedLocationColumn}
                onChange={(e) => setSelectedLocationColumn(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-600"
              >
                <option value="">Selecione uma coluna</option>
                {projectData?.columns?.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Coluna de Valores (Opcional)</label>
              <select
                value={selectedValueColumn}
                onChange={(e) => setSelectedValueColumn(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-600"
              >
                <option value="">Apenas contagem</option>
                {projectData?.columns?.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateAnalysis}
              disabled={generatingAnalysis || !selectedLocationColumn}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {generatingAnalysis ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <span>🌍</span>
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
                    Análise Geográfica
                  </h1>
                  <p className="text-gray-600">
                    Visualize dados por localização e identifique padrões regionais
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    📊 Exportar Mapa
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
                    <div className="text-2xl">🌍</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {projectData.workspace_name || projectData.table_name}
                      </h3>
                      <p className="text-gray-600">
                        Localização: <strong>{selectedLocationColumn || 'Não selecionada'}</strong>
                        {selectedValueColumn && ` • Valores: ${selectedValueColumn}`} • {projectData.row_count?.toLocaleString()} registros
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
                  Distribuição Geográfica - {selectedLocationColumn || 'Localização'}
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
                    type="bar"
                    data={{
                      labels: Object.keys(analysisResults.result.location_counts || {}),
                      values: Object.values(analysisResults.result.location_counts || {})
                    }}
                    height={384}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Clique em &quot;Gerar Análise&quot; para visualizar a distribuição geográfica</p>
                  </div>
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights Geográficos</h3>
                <div className="space-y-3">
                  {analysisResults ? (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-lg">🌍</div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Distribuição Regional</p>
                          <p className="text-xs text-blue-700">
                            {analysisResults.result.total_locations} localizações analisadas
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-lg">📊</div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Top Localizações</p>
                          <p className="text-xs text-green-700">
                            Top 5 localizações por volume de dados
                          </p>
                        </div>
                      </div>

                      {analysisResults.result.value_analysis && (
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="text-yellow-600 text-lg">💰</div>
                          <div>
                            <p className="text-sm font-medium text-yellow-900">Análise de Valores</p>
                            <p className="text-xs text-yellow-700">
                              Médias e totais por localização incluídos
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-lg">🌍</div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Distribuição Regional</p>
                          <p className="text-xs text-blue-700">Dados distribuídos por região geográfica</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-lg">📊</div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Concentração</p>
                          <p className="text-xs text-green-700">Algumas regiões concentram mais dados</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="text-yellow-600 text-lg">⚠️</div>
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Regiões Menores</p>
                          <p className="text-xs text-yellow-700">Algumas localizações têm poucos dados</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Métricas Geográficas</h3>
                <div className="space-y-3">
                  {analysisResults ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total de Localizações:</span>
                        <span className="font-medium">{analysisResults.result.total_locations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coluna de Localização:</span>
                        <span className="font-medium">{analysisResults.location_column}</span>
                      </div>
                      {analysisResults.value_column && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coluna de Valores:</span>
                          <span className="font-medium">{analysisResults.value_column}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Análise de Valores:</span>
                        <span className="font-medium">
                          {analysisResults.result.value_analysis ? 'Incluída' : 'Apenas contagem'}
                        </span>
                      </div>
                      {analysisResults.result.location_counts && Object.keys(analysisResults.result.location_counts).length > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Localização Principal:</span>
                            <span className="font-medium">
                              {Object.keys(analysisResults.result.location_counts)[0]}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Registros na Principal:</span>
                            <span className="font-medium">
                              {Object.values(analysisResults.result.location_counts)[0] as number}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total de Localizações:</span>
                        <span className="font-medium">15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Região Principal:</span>
                        <span className="font-medium">Sudeste</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Concentração:</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dispersão:</span>
                        <span className="font-medium">Média</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cobertura:</span>
                        <span className="font-medium">Nacional</span>
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
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/correlation_matrix`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🔗</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise de Correlação</h4>
                  <p className="text-sm text-gray-600">Descubra relacionamentos entre variáveis</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
