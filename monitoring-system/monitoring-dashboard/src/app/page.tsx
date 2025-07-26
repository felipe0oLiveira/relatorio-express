'use client';

import React, { useState, useEffect } from 'react';

interface Metrics {
  timestamp?: string;
  overall_status?: string;
  health?: {
    error_rate?: number;
    status?: string;
  };
  performance?: {
    avg_response_time?: number;
    requests_per_minute?: number;
    top_endpoints?: Array<{
      endpoint: string;
      count: number;
    }>;
  };
  summary?: {
    active_users?: number;
  };
  business?: {
    unique_users?: number;
    total_analyses?: number;
    success_rate?: number;
    avg_analyses_per_user?: number;
  };
  database?: {
    connection_status?: string;
    table_counts?: {
      [key: string]: number | string;
    };
  };
}

interface EndpointMetrics {
  endpoint: string;
  count: number;
  avg_response_time: number;
  error_count: number;
  last_accessed: string;
}

interface UserActivity {
  user_id: string;
  last_activity: string;
  request_count: number;
  files_uploaded: number;
  analyses_performed: number;
  session_duration: number;
}

interface MetricsHistory {
  timestamp: string;
  response_times: number[];
  request_count: number;
  error_count: number;
  active_users: number;
  analyses_performed: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [endpointMetrics, setEndpointMetrics] = useState<EndpointMetrics[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<MetricsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAllMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard metrics
      const dashboardResponse = await fetch('http://localhost:8000/monitoring/dashboard');
      const dashboardData = await dashboardResponse.json();
      setMetrics(dashboardData);

      // Fetch endpoint metrics
      try {
        const endpointsResponse = await fetch('http://localhost:8000/monitoring/endpoints');
        const endpointsData = await endpointsResponse.json();
        setEndpointMetrics(endpointsData.endpoints || []);
      } catch (e) {
        console.log('Endpoints endpoint not available');
      }

      // Fetch user activity
      try {
        const usersResponse = await fetch('http://localhost:8000/monitoring/users');
        const usersData = await usersResponse.json();
        setUserActivity(usersData.users || []);
      } catch (e) {
        console.log('Users endpoint not available');
      }

      // Fetch metrics history
      try {
        const historyResponse = await fetch('http://localhost:8000/monitoring/history');
        const historyData = await historyResponse.json();
        setMetricsHistory(historyData.history || []);
      } catch (e) {
        console.log('History endpoint not available');
      }

      setError(null);
    } catch (err) {
      setError('Erro ao carregar métricas');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAllMetrics, 30000); // Atualiza a cada 30s
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status?: string): string => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '❌';
      default: return '🔄';
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Erro ao Carregar</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchAllMetrics}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold">🔧 Monitoramento do Sistema</h1>
              <p className="text-gray-400 mt-2">Painel de controle para desenvolvedor</p>
            </div>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded ${autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                🔄 Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </button>
              <button 
                onClick={fetchAllMetrics}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                🔄 Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              📊 Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'endpoints'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              🔗 Endpoints
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              👥 Usuários
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              📈 Histórico
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Status Geral */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  📊 Status Geral do Sistema
                </h3>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(metrics?.overall_status)}`}>
                    {getStatusIcon(metrics?.overall_status)}
                    {metrics?.overall_status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                  <span className="text-sm text-gray-400">
                    Sistema operacional e funcionando normalmente
                  </span>
                  <span className="text-sm text-gray-500">
                    Última atualização: {metrics?.timestamp ? new Date(metrics.timestamp).toLocaleString('pt-BR') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Health */}
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Saúde da Aplicação</h3>
                    <span className="text-green-600">✅</span>
                  </div>
                  <div className="text-2xl font-bold">{metrics?.health?.error_rate || 0}%</div>
                  <p className="text-xs text-gray-400 mb-2">Taxa de erro</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metrics?.health?.status)}`}>
                    {metrics?.health?.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Performance</h3>
                    <span className="text-blue-600">📈</span>
                  </div>
                  <div className="text-2xl font-bold">{metrics?.performance?.avg_response_time || 0}ms</div>
                  <p className="text-xs text-gray-400 mb-2">Tempo médio de resposta</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-900">
                    {metrics?.performance?.requests_per_minute || 0} req/min
                  </span>
                </div>
              </div>

              {/* Users */}
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Usuários Ativos</h3>
                    <span className="text-purple-600">👥</span>
                  </div>
                  <div className="text-2xl font-bold">{metrics?.summary?.active_users || 0}</div>
                  <p className="text-xs text-gray-400 mb-2">Usuários ativos agora</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-purple-600 bg-purple-900">
                    {metrics?.business?.unique_users || 0} únicos (7d)
                  </span>
                </div>
              </div>

              {/* Database */}
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Banco de Dados</h3>
                    <span className="text-orange-600">🗄️</span>
                  </div>
                  <div className="text-2xl font-bold">{typeof metrics?.database?.table_counts?.reports === 'number' ? metrics.database.table_counts.reports : 0}</div>
                  <p className="text-xs text-gray-400 mb-2">Relatórios no sistema</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metrics?.database?.connection_status)}`}>
                    {metrics?.database?.connection_status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Detalhes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Métricas de Negócio */}
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Métricas de Negócio</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total de Análises (7d):</span>
                      <span className="font-semibold">{metrics?.business?.total_analyses || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Sucesso:</span>
                      <span className="font-semibold">{metrics?.business?.success_rate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usuários Únicos (7d):</span>
                      <span className="font-semibold">{metrics?.business?.unique_users || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Média por Usuário:</span>
                      <span className="font-semibold">{metrics?.business?.avg_analyses_per_user || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Endpoints */}
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Endpoints Mais Utilizados</h3>
                  {metrics?.performance?.top_endpoints && metrics.performance.top_endpoints.length > 0 ? (
                    <div className="space-y-2">
                      {metrics.performance.top_endpoints.slice(0, 5).map((endpoint, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                          <span className="text-sm font-mono">{endpoint.endpoint}</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
                            {endpoint.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Nenhum endpoint registrado ainda</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabelas do Banco */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 mt-6">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Status das Tabelas do Banco</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {metrics?.database?.table_counts && Object.entries(metrics.database.table_counts).map(([table, count]) => (
                    <div key={table} className="text-center p-4 bg-gray-700 rounded">
                      <div className="text-2xl font-bold text-blue-400">{count}</div>
                      <div className="text-sm text-gray-400 capitalize">{table}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Endpoints Tab */}
        {activeTab === 'endpoints' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Métricas de Endpoints</h3>
              {endpointMetrics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Endpoint</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Requisições</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tempo Médio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Erros</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Último Acesso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {endpointMetrics.map((endpoint, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{endpoint.endpoint}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{endpoint.count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{endpoint.avg_response_time}ms</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{endpoint.error_count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {endpoint.last_accessed ? new Date(endpoint.last_accessed).toLocaleString('pt-BR') : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Nenhum endpoint registrado ainda</p>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Atividade dos Usuários</h3>
              {userActivity.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuário</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Última Atividade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Requisições</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Uploads</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Análises</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duração Sessão</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {userActivity.map((user, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{user.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.last_activity ? new Date(user.last_activity).toLocaleString('pt-BR') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.request_count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.files_uploaded}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.analyses_performed}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.session_duration}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Nenhum usuário ativo registrado</p>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Histórico de Métricas</h3>
              {metricsHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Requisições</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Erros</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuários Ativos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Análises</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {metricsHistory.slice(0, 10).map((entry, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(entry.timestamp).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.request_count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.error_count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.active_users}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.analyses_performed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Nenhum histórico disponível</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
