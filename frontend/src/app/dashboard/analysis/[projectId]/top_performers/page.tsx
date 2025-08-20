"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '../../../../../services/apiService';
import ChartComponent from '../../../../../components/ChartComponent';

export default function TopPerformersPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;
  
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryColumn, setSelectedCategoryColumn] = useState('');
  const [selectedValueColumn, setSelectedValueColumn] = useState('');
  const [topCount, setTopCount] = useState(10);
  const [rankingType, setRankingType] = useState('value');
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [performersData, setPerformersData] = useState(null);

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
          // Auto-select category and value columns
          if (project.columns) {
            const categoryColumns = project.columns.filter((col: string) => 
              col.toLowerCase().includes('retailer') || 
              col.toLowerCase().includes('product') ||
              col.toLowerCase().includes('region') ||
              col.toLowerCase().includes('state') ||
              col.toLowerCase().includes('city')
            );
            const valueColumns = project.columns.filter((col: string) => 
              col.toLowerCase().includes('sales') || 
              col.toLowerCase().includes('value') ||
              col.toLowerCase().includes('amount') ||
              col.toLowerCase().includes('total') ||
              col.toLowerCase().includes('units')
            );
            
            if (categoryColumns.length > 0) {
              setSelectedCategoryColumn(categoryColumns[0]);
            }
            if (valueColumns.length > 0) {
              setSelectedValueColumn(valueColumns[0]);
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

  const rankingTypes = [
    { id: 'value', name: 'Por Valor', icon: '💰', description: 'Ranking por valor total' },
    { id: 'volume', name: 'Por Volume', icon: '📦', description: 'Ranking por quantidade' },
    { id: 'growth', name: 'Por Crescimento', icon: '📈', description: 'Ranking por taxa de crescimento' },
    { id: 'efficiency', name: 'Por Eficiência', icon: '⚡', description: 'Ranking por eficiência' }
  ];

  const topCountOptions = [5, 10, 15, 20, 25];

  const handleGenerateTopPerformers = async () => {
    if (!selectedCategoryColumn || !selectedValueColumn) {
      alert('Selecione as colunas de categoria e valor para análise.');
      return;
    }

    try {
      setGeneratingAnalysis(true);
      
      console.log('Gerando análise de top performers:', { 
        projectId, 
        selectedCategoryColumn, 
        selectedValueColumn,
        topCount,
        rankingType 
      });
      
      // Simular geração de análise
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular dados de top performers
      const mockPerformersData = {
        topPerformers: [
          { name: 'Foot Locker', value: 2500000, growth: 15.2, efficiency: 0.85, rank: 1 },
          { name: 'Nike Store', value: 2200000, growth: 12.8, efficiency: 0.82, rank: 2 },
          { name: 'Adidas Outlet', value: 1950000, growth: 18.5, efficiency: 0.78, rank: 3 },
          { name: 'Sports Direct', value: 1800000, growth: 8.9, efficiency: 0.75, rank: 4 },
          { name: 'JD Sports', value: 1650000, growth: 22.1, efficiency: 0.72, rank: 5 },
          { name: 'Dick\'s Sporting', value: 1500000, growth: 11.3, efficiency: 0.70, rank: 6 },
          { name: 'Academy Sports', value: 1350000, growth: 9.7, efficiency: 0.68, rank: 7 },
          { name: 'Big 5 Sporting', value: 1200000, growth: 7.4, efficiency: 0.65, rank: 8 },
          { name: 'Modell\'s', value: 1100000, growth: 5.2, efficiency: 0.62, rank: 9 },
          { name: 'Finish Line', value: 1000000, growth: 13.8, efficiency: 0.60, rank: 10 }
        ],
        insights: [
          'Foot Locker lidera com $2.5M em vendas e 15.2% de crescimento',
          'Top 3 representam 45% do total de vendas',
          'Adidas Outlet tem maior crescimento (18.5%) entre os top 5',
          'Eficiência média dos top 10: 72.7%',
          'Gap significativo entre 1º e 2º lugar ($300K)'
        ],
        metrics: {
          totalValue: 15250000,
          averageGrowth: 13.5,
          averageEfficiency: 0.727,
          top3Percentage: 45.2
        }
      };
      
      setPerformersData(mockPerformersData);
      alert('Análise de top performers gerada com sucesso!');
      
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
            <p className="text-gray-600">Carregando análise de top performers...</p>
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
              <label className="block text-xs text-gray-400 mb-1">Coluna de Categoria</label>
              <select
                value={selectedCategoryColumn}
                onChange={(e) => setSelectedCategoryColumn(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-600"
              >
                <option value="">Selecione coluna de categoria</option>
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
                <option value="">Selecione coluna de valor</option>
                {projectData?.columns?.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Quantidade Top</label>
              <select
                value={topCount}
                onChange={(e) => setTopCount(Number(e.target.value))}
                className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-600"
              >
                {topCountOptions.map((count) => (
                  <option key={count} value={count}>Top {count}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateTopPerformers}
              disabled={generatingAnalysis || !selectedCategoryColumn || !selectedValueColumn}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {generatingAnalysis ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <span>🏆</span>
                  Gerar Top Performers
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
                    Top Performers
                  </h1>
                  <p className="text-gray-600">
                    Identifique os melhores performers nos seus dados
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
                    <div className="text-2xl">🏆</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {projectData.workspace_name || projectData.table_name}
                      </h3>
                      <p className="text-gray-600">
                        Analisando: <strong>{selectedValueColumn}</strong> por <strong>{selectedCategoryColumn}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ranking Types */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tipos de Ranking</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {rankingTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setRankingType(type.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      rankingType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            {performersData && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top {topCount} Performers - {rankingTypes.find(t => t.id === rankingType)?.name}
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

                {/* Performers Chart */}
                <div className="h-96">
                  <ChartComponent
                    type="horizontalBar"
                    data={{
                      labels: performersData.topPerformers.map(p => p.name),
                      datasets: [{
                        label: selectedValueColumn || 'Valor',
                        data: performersData.topPerformers.map(p => p.value),
                        backgroundColor: performersData.topPerformers.map((p, i) => 
                          i === 0 ? '#FFD700' : 
                          i === 1 ? '#C0C0C0' : 
                          i === 2 ? '#CD7F32' : '#3B82F6'
                        ),
                        borderColor: performersData.topPerformers.map((p, i) => 
                          i === 0 ? '#FFD700' : 
                          i === 1 ? '#C0C0C0' : 
                          i === 2 ? '#CD7F32' : '#3B82F6'
                        ),
                        borderWidth: 1
                      }]
                    }}
                    height={384}
                  />
                </div>
              </div>
            )}

            {/* Insights */}
            {performersData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights de Performance</h3>
                  <div className="space-y-3">
                    {performersData.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-lg">💡</div>
                        <div>
                          <p className="text-sm text-blue-900">{insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Métricas Gerais</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor Total Top {topCount}:</span>
                      <span className="font-medium text-green-600">${(performersData.metrics.totalValue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crescimento Médio:</span>
                      <span className="font-medium text-blue-600">{performersData.metrics.averageGrowth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Eficiência Média:</span>
                      <span className="font-medium text-purple-600">{(performersData.metrics.averageEfficiency * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top 3 (% do total):</span>
                      <span className="font-medium text-orange-600">{performersData.metrics.top3Percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Performers Table */}
            {performersData && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Ranking Detalhado</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Rank</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Nome</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Valor</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Crescimento</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Eficiência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performersData.topPerformers.map((performer, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="px-4 py-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {performer.rank}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{performer.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">${performer.value.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-green-600">+{performer.growth}%</td>
                          <td className="px-4 py-3 text-sm text-purple-600">{(performer.efficiency * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Próximos Passos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/temporal_trends`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📈</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise de Tendências</h4>
                  <p className="text-sm text-gray-600">Investigue a evolução dos top performers</p>
                </button>
                
                <button 
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/correlation_matrix`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🔗</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise de Correlação</h4>
                  <p className="text-sm text-gray-600">Descubra fatores que levam ao sucesso</p>
                </button>
                
                <button 
                  onClick={() => router.push(`/dashboard/analysis/${projectId}/geographic_analysis`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🌍</div>
                  <h4 className="font-medium text-gray-900 mb-1">Análise Geográfica</h4>
                  <p className="text-sm text-gray-600">Compare performance por região</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

