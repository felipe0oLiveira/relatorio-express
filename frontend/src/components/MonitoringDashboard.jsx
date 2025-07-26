import React, { useState, useEffect } from 'react';

const MonitoringDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // segundos

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/monitoring/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Erro ao carregar dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Dashboard de Monitoramento</h1>
              <p className="text-gray-600">Visão completa do sistema AutoReport SaaS</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={refreshInterval} 
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={10}>Atualizar a cada 10s</option>
                <option value={30}>Atualizar a cada 30s</option>
                <option value={60}>Atualizar a cada 1min</option>
              </select>
              <button 
                onClick={fetchDashboardData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                🔄 Atualizar
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Última atualização: {new Date(dashboardData.timestamp).toLocaleString()}
          </div>
        </div>

        {/* Alertas */}
        {dashboardData.alerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🚨 Alertas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.alerts.map((alert, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getAlertIcon(alert.type)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* CPU */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CPU</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.system.cpu_usage.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">🖥️</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    dashboardData.system.cpu_usage > 80 ? 'bg-red-500' :
                    dashboardData.system.cpu_usage > 60 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(dashboardData.system.cpu_usage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Memory */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Memória</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.system.memory_usage.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💾</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    dashboardData.system.memory_usage > 80 ? 'bg-red-500' :
                    dashboardData.system.memory_usage > 60 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(dashboardData.system.memory_usage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Error Rate */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Erro</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.performance.error_rate.toFixed(2)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">❌</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    dashboardData.performance.error_rate > 5 ? 'bg-red-500' :
                    dashboardData.performance.error_rate > 2 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(dashboardData.performance.error_rate * 10, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Banco de Dados</p>
                <p className={`text-2xl font-bold ${
                  dashboardData.database.health.status === 'healthy' ? 'text-green-600' :
                  dashboardData.database.health.status === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {dashboardData.database.health.status}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">🗄️</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {dashboardData.database.health.response_time?.toFixed(3)}s
              </p>
            </div>
          </div>
        </div>

        {/* Métricas de Negócio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Usuários */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Usuários</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData.business.user_metrics.total_users}
                </p>
                <p className="text-sm text-gray-600">Total de Usuários</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.business.user_metrics.active_users}
                </p>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
              </div>
            </div>
          </div>

          {/* Análises */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Análises</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData.business.analysis_metrics.total_analyses}
                </p>
                <p className="text-sm text-gray-600">Total de Análises</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.business.analysis_metrics.success_rate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance dos Endpoints */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Performance dos Endpoints</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Endpoint</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Requisições</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tempo Médio</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Taxa de Erro</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Último Acesso</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dashboardData.performance.endpoints).slice(0, 10).map(([endpoint, metrics]) => (
                  <tr key={endpoint} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{endpoint}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{metrics.count}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {metrics.avg_response_time.toFixed(3)}s
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {((metrics.error_count / metrics.count) * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {metrics.last_accessed ? new Date(metrics.last_accessed).toLocaleTimeString() : 'Nunca'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard; 