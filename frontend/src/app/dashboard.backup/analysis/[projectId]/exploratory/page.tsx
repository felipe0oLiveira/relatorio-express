"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '../../../../../services/apiService';
import ChartComponent from '../../../../../components/ChartComponent';
import ChartSelector, { ChartType } from '../../../../../components/ChartSelector';

export default function ExploratoryAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;

  const [projectData, setProjectData] = useState<{
    id: string;
    workspace_name: string;
    columns?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [analysisType, setAnalysisType] = useState('distribution');
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('bar');
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    distribution?: { [key: string]: number };
    summary?: { mean: number; median: number; std: number; min: number; max: number };
    outliers?: string[];
    correlations?: { [key: string]: number };
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
          if (project.columns && project.columns.length > 0) {
            setSelectedColumn(project.columns[0]);
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

  // Análises simplificadas e mais intuitivas
  const analysisTypes = [
    { 
      id: 'distribution', 
      name: 'Distribuição', 
      icon: '📊', 
      description: 'Como os valores estão distribuídos',
      color: 'bg-blue-50 border-blue-200',
      selectedColor: 'bg-blue-100 border-blue-400'
    },
    { 
      id: 'correlation', 
      name: 'Relacionamentos', 
      icon: '🔗', 
      description: 'Como esta coluna se relaciona com outras',
      color: 'bg-green-50 border-green-200',
      selectedColor: 'bg-green-100 border-green-400'
    },
    { 
      id: 'outliers', 
      name: 'Valores Especiais', 
      icon: '⚠️', 
      description: 'Encontrar valores que se destacam',
      color: 'bg-yellow-50 border-yellow-200',
      selectedColor: 'bg-yellow-100 border-yellow-400'
    },
    { 
      id: 'summary', 
      name: 'Resumo', 
      icon: '📋', 
      description: 'Estatísticas principais da coluna',
      color: 'bg-purple-50 border-purple-200',
      selectedColor: 'bg-purple-100 border-purple-400'
    }
  ];

  const handleGenerateAnalysis = async () => {
    if (!selectedColumn) {
      alert('Selecione uma coluna para análise.');
      return;
    }

    try {
      setGeneratingAnalysis(true);
      console.log('Gerando análise exploratória:', { projectId, selectedColumn, analysisType });

      const response = await apiService.generateExploratoryAnalysis(projectId, selectedColumn, analysisType);
      console.log('✅ Análise exploratória gerada:', response);

      setAnalysisResults(response.result);
      alert('Análise exploratória gerada com sucesso!');

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
            <p className="text-gray-600">Carregando análise exploratória...</p>
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
              <label className="block text-xs text-gray-400 mb-1">Coluna para Analisar</label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-600"
              >
                {projectData?.columns?.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Tipo de Análise</label>
              <div className="space-y-2">
                {analysisTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setAnalysisType(type.id)}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      analysisType === type.id ? 'bg-gray-700' : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{type.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{type.name}</div>
                        <div className="text-xs text-gray-400">{type.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateAnalysis}
              disabled={generatingAnalysis || !selectedColumn}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {generatingAnalysis ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analisando...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Analisar Coluna
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Análise Exploratória
                  </h1>
                  <p className="text-gray-600">
                    Explore padrões e insights nos seus dados
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    📊 Exportar
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    💾 Salvar
                  </button>
                </div>
              </div>

              {/* Project Info */}
              {projectData && (
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">📊</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {projectData.workspace_name || projectData.table_name}
                      </h3>
                      <p className="text-gray-600">
                        Analisando: <strong>{selectedColumn}</strong> • {projectData.row_count?.toLocaleString()} registros
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Types */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">O que você quer descobrir?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysisTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setAnalysisType(type.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      analysisType === type.id
                        ? type.selectedColor
                        : type.color
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {analysisTypes.find(t => t.id === analysisType)?.name} - {selectedColumn}
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

              {/* Chart Selector */}
              <div className="mb-6">
                <ChartSelector
                  selectedType={selectedChartType}
                  onTypeChange={(type) => {
                    console.log('Mudando tipo de gráfico para:', type);
                    setSelectedChartType(type);
                  }}
                  disabled={!analysisResults}
                />
              </div>



              {/* Chart Component */}
              <div className="h-96">
                {analysisResults ? (
                  <ChartComponent
                    key={`${selectedChartType}-${selectedColumn}-${Date.now()}`} // Força re-render quando muda o tipo
                    type={selectedChartType}
                    data={(() => {
                      console.log('🔄 Processando dados para:', selectedChartType);
                      console.log('📊 Analysis Results:', analysisResults);
                      
                      // Dados de exemplo para Units Sold
                      const unitsSoldData = {
                        bars: [
                          { label: '0-1000', value: 150 },
                          { label: '1000-2000', value: 300 },
                          { label: '2000-3000', value: 450 },
                          { label: '3000-4000', value: 200 },
                          { label: '4000+', value: 100 }
                        ],
                        points: [
                          { x: 1, y: 150 }, { x: 2, y: 300 }, { x: 3, y: 450 },
                          { x: 4, y: 200 }, { x: 5, y: 100 }
                        ],
                        slices: [
                          { label: '0-1000', value: 150 },
                          { label: '1000-2000', value: 300 },
                          { label: '2000-3000', value: 450 },
                          { label: '3000-4000', value: 200 },
                          { label: '4000+', value: 100 }
                        ],
                        bins: [
                          { label: '0-1000', frequency: 150 },
                          { label: '1000-2000', frequency: 300 },
                          { label: '2000-3000', frequency: 450 },
                          { label: '3000-4000', frequency: 200 },
                          { label: '4000+', frequency: 100 }
                        ],
                        matrix: [
                          [1.0, 0.8, 0.6],
                          [0.8, 1.0, 0.7],
                          [0.6, 0.7, 1.0]
                        ]
                      };

                      switch (selectedChartType) {
                        case 'bar':
                        case 'column':
                          return { bars: unitsSoldData.bars };
                        case 'line':
                        case 'area':
                          return { points: unitsSoldData.points };
                        case 'pie':
                          return { slices: unitsSoldData.slices };
                        case 'scatter':
                          return { points: unitsSoldData.points };
                        case 'histogram':
                          return { bins: unitsSoldData.bins };
                        case 'heatmap':
                          return { matrix: unitsSoldData.matrix };
                        default:
                          return { bars: unitsSoldData.bars };
                      }
                    })()}
                    options={{
                      title: `${selectedChartType.toUpperCase()}: ${selectedColumn}`,
                      showGrid: true,
                      showLegend: true
                    }}
                    height={384}
                    onChartClick={(data) => {
                      console.log('Gráfico clicado:', data);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📊</div>
                      <p>Clique em &quot;Analisar Coluna&quot; para visualizar os dados</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights</h3>
                <div className="space-y-3">
                  {analysisResults ? (
                    analysisType === 'distribution' && analysisResults.type === 'numeric' ? (
                      <>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="text-blue-600 text-lg">📊</div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">Distribuição</p>
                            <p className="text-xs text-blue-700">
                              Média: {analysisResults.stats.mean.toFixed(2)},
                              Mediana: {analysisResults.stats.median.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="text-green-600 text-lg">📈</div>
                          <div>
                            <p className="text-sm font-medium text-green-900">Estatísticas</p>
                            <p className="text-xs text-green-700">
                              Min: {analysisResults.stats.min.toFixed(2)},
                              Max: {analysisResults.stats.max.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : analysisType === 'correlation' && analysisResults.type === 'numeric' ? (
                      <>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="text-blue-600 text-lg">🔗</div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">Correlações</p>
                            <p className="text-xs text-blue-700">
                              {analysisResults.strong_correlations.length} correlações fortes encontradas
                            </p>
                          </div>
                        </div>
                      </>
                    ) : analysisType === 'outliers' && analysisResults.type === 'numeric' ? (
                      <>
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="text-yellow-600 text-lg">⚠️</div>
                          <div>
                            <p className="text-sm font-medium text-yellow-900">Valores Especiais</p>
                            <p className="text-xs text-yellow-700">
                              {analysisResults.outliers_count} valores especiais ({analysisResults.outliers_percentage.toFixed(1)}%)
                            </p>
                          </div>
                        </div>
                      </>
                    ) : analysisType === 'summary' && analysisResults.type === 'numeric' ? (
                      <>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="text-blue-600 text-lg">📋</div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">Resumo Estatístico</p>
                            <p className="text-xs text-blue-700">
                              {analysisResults.count} registros, {analysisResults.missing_count} valores faltantes
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {analysisResults.message || 'Análise não aplicável para este tipo de dados'}
                      </div>
                    )
                  ) : (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-lg">💡</div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Distribuição Normal</p>
                          <p className="text-xs text-blue-700">Os dados seguem uma distribuição aproximadamente normal</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-lg">✅</div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Sem Valores Especiais</p>
                          <p className="text-xs text-green-700">Não foram detectados valores atípicos significativos</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Estatísticas</h3>
                <div className="space-y-3">
                  {analysisResults && analysisResults.type === 'numeric' ? (
                    analysisType === 'summary' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Média:</span>
                          <span className="font-medium">{analysisResults.mean.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mediana:</span>
                          <span className="font-medium">{analysisResults['50%'].toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Desvio Padrão:</span>
                          <span className="font-medium">{analysisResults.std.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mínimo:</span>
                          <span className="font-medium">{analysisResults.min.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Máximo:</span>
                          <span className="font-medium">{analysisResults.max.toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Média:</span>
                          <span className="font-medium">{analysisResults.stats.mean.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mediana:</span>
                          <span className="font-medium">{analysisResults.stats.median.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Desvio Padrão:</span>
                          <span className="font-medium">{analysisResults.stats.std.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mínimo:</span>
                          <span className="font-medium">{analysisResults.stats.min.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Máximo:</span>
                          <span className="font-medium">{analysisResults.stats.max.toFixed(2)}</span>
                        </div>
                      </>
                    )
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Média:</span>
                        <span className="font-medium">245.67</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mediana:</span>
                        <span className="font-medium">238.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Desvio Padrão:</span>
                        <span className="font-medium">45.23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mínimo:</span>
                        <span className="font-medium">12.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Máximo:</span>
                        <span className="font-medium">498.00</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Próximos Passos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/temporal_trends`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📈</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise de Tendências</h4>
                  <p className="text-sm text-gray-600">Identifique padrões temporais nos dados</p>
                </button>

                <button
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/correlation_matrix`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🔍</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise de Correlação</h4>
                  <p className="text-sm text-gray-600">Descubra relacionamentos entre variáveis</p>
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