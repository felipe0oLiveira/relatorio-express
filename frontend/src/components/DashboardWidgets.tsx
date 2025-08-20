"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface WidgetData {
  type: string;
  title: string;
  icon: string;
  data: any;
  insights?: string[];
  error?: string;
}

interface DashboardWidgetsProps {
  workspaceId: string;
  workspaceName?: string;
  analysisTypes?: string;
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ workspaceId, workspaceName, analysisTypes }) => {
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWidgets();
  }, [workspaceId, analysisTypes]);

  const loadWidgets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardWidgets(workspaceId, analysisTypes);
      
      // Verificar se a resposta é válida
      if (!response || typeof response !== 'object') {
        throw new Error('Resposta inválida da API');
      }
      
      // Verificar se widgets existe e é um array
      const widgetsData = response.widgets || [];
      if (!Array.isArray(widgetsData)) {
        throw new Error('Formato de widgets inválido');
      }
      
      // Filtrar widgets válidos e verificar se não são objetos vazios
      const validWidgets = widgetsData.filter(widget => 
        widget && 
        typeof widget === 'object' && 
        Object.keys(widget).length > 0 && // Verificar se não é um objeto vazio
        widget.type && 
        widget.title && 
        widget.data
      );
      
      setWidgets(validWidgets);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar widgets:', err);
      setError(err.message || 'Erro ao carregar widgets');
    } finally {
      setLoading(false);
    }
  };

  const renderExecutiveSummary = (widget: WidgetData) => {
    // Verificar se os dados são válidos
    if (!widget.data || typeof widget.data !== 'object') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-red-600 text-sm">Dados inválidos para este widget</div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
          <span className="text-2xl">{widget.icon}</span>
        </div>
        
        {widget.error ? (
          <div className="text-red-600 text-sm">{widget.error}</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {widget.data.total_records || 0}
                </div>
                <div className="text-sm text-blue-800">Registros</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {widget.data.total_columns || 0}
                </div>
                <div className="text-sm text-green-800">Colunas</div>
              </div>
            </div>
            
            {widget.data.averages && typeof widget.data.averages === 'object' && Object.keys(widget.data.averages).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Médias Principais:</h4>
                <div className="space-y-1">
                  {Object.entries(widget.data.averages).slice(0, 3).map(([col, avg]) => (
                    <div key={col} className="flex justify-between text-sm">
                      <span className="text-gray-600">{col}:</span>
                      <span className="font-medium">{Number(avg).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {widget.insights && Array.isArray(widget.insights) && widget.insights.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Insights:</h4>
                <ul className="space-y-1">
                  {widget.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTemporalTrends = (widget: WidgetData) => {
    if (!widget.data || typeof widget.data !== 'object') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-red-600 text-sm">Dados inválidos para este widget</div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
          <span className="text-2xl">{widget.icon}</span>
        </div>
        
        {widget.error ? (
          <div className="text-red-600 text-sm">{widget.error}</div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {widget.data.trend_direction || 'N/A'}
              </div>
              <div className="text-sm text-blue-800">Tendência</div>
            </div>
            
            {widget.data.periods && Array.isArray(widget.data.periods) && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Períodos Analisados:</h4>
                <div className="space-y-1">
                  {widget.data.periods.slice(0, 5).map((period: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{period.period}:</span>
                      <span className="font-medium">{period.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderValueDistribution = (widget: WidgetData) => {
    if (!widget.data || typeof widget.data !== 'object') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-red-600 text-sm">Dados inválidos para este widget</div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
          <span className="text-2xl">{widget.icon}</span>
        </div>
        
        {widget.error ? (
          <div className="text-red-600 text-sm">{widget.error}</div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {widget.data.total_values || 0}
              </div>
              <div className="text-sm text-purple-800">Valores Únicos</div>
            </div>
            
            {widget.data.distribution && Array.isArray(widget.data.distribution) && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Distribuição:</h4>
                <div className="space-y-2">
                  {widget.data.distribution.slice(0, 5).map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.value}:</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCorrelationMatrix = (widget: WidgetData) => {
    if (!widget.data || typeof widget.data !== 'object') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-red-600 text-sm">Dados inválidos para este widget</div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
          <span className="text-2xl">{widget.icon}</span>
        </div>
        
        {widget.error ? (
          <div className="text-red-600 text-sm">{widget.error}</div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {widget.data.correlation_count || 0}
              </div>
              <div className="text-sm text-green-800">Correlações Encontradas</div>
            </div>
            
            {widget.data.correlations && Array.isArray(widget.data.correlations) && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Principais Correlações:</h4>
                <div className="space-y-2">
                  {widget.data.correlations.slice(0, 3).map((corr: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{corr.variables}:</span>
                      <span className="font-medium">{corr.correlation.toFixed(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTopPerformers = (widget: WidgetData) => {
    if (!widget.data || typeof widget.data !== 'object') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-red-600 text-sm">Dados inválidos para este widget</div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
          <span className="text-2xl">{widget.icon}</span>
        </div>
        
        {widget.error ? (
          <div className="text-red-600 text-sm">{widget.error}</div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {widget.data.top_count || 0}
              </div>
              <div className="text-sm text-yellow-800">Top Performers</div>
            </div>
            
            {widget.data.top_performers && Array.isArray(widget.data.top_performers) && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Melhores Resultados:</h4>
                <div className="space-y-2">
                  {widget.data.top_performers.slice(0, 5).map((performer: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{performer.name}:</span>
                      <span className="font-medium">{performer.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderGeographicAnalysis = (widget: WidgetData) => {
    if (!widget.data || typeof widget.data !== 'object') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-red-600 text-sm">Dados inválidos para este widget</div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
          <span className="text-2xl">{widget.icon}</span>
        </div>
        
        {widget.error ? (
          <div className="text-red-600 text-sm">{widget.error}</div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-indigo-600">
                {widget.data.region_count || 0}
              </div>
              <div className="text-sm text-indigo-800">Regiões Analisadas</div>
            </div>
            
            {widget.data.regions && Array.isArray(widget.data.regions) && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Principais Regiões:</h4>
                <div className="space-y-2">
                  {widget.data.regions.slice(0, 5).map((region: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{region.name}:</span>
                      <span className="font-medium">{region.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderWidget = (widget: WidgetData) => {
    // Verificar se o widget é válido
    if (!widget || typeof widget !== 'object' || Object.keys(widget).length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-red-600 text-sm">Widget inválido ou vazio</div>
        </div>
      );
    }

    switch (widget.type) {
      case 'executive_summary':
        return renderExecutiveSummary(widget);
      case 'temporal_trends':
        return renderTemporalTrends(widget);
      case 'value_distribution':
        return renderValueDistribution(widget);
      case 'correlation_matrix':
        return renderCorrelationMatrix(widget);
      case 'top_performers':
        return renderTopPerformers(widget);
      case 'geographic_analysis':
        return renderGeographicAnalysis(widget);
      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{widget.title || 'Widget'}</h3>
              <span className="text-2xl">{widget.icon || '📊'}</span>
            </div>
            <div className="text-gray-600">Widget não implementado: {widget.type}</div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando widgets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <span className="text-red-500 mr-2">⚠️</span>
          <span className="text-red-700">Erro ao carregar widgets: {error}</span>
        </div>
        <button
          onClick={loadWidgets}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (widgets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <span className="text-4xl mb-4 block">📊</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum widget disponível</h3>
          <p className="text-gray-600">Não foi possível gerar widgets para este workspace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {widgets.map((widget, index) => {
        // Verificação adicional para garantir que não seja renderizado um objeto vazio
        if (!widget || typeof widget !== 'object' || Object.keys(widget).length === 0) {
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-red-600 text-sm">Widget inválido ou vazio</div>
            </div>
          );
        }
        
        return (
          <div key={index}>
            {renderWidget(widget)}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardWidgets;

