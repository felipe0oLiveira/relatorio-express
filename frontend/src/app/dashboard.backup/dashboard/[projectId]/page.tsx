"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import DashboardWidgets from '../../../../components/DashboardWidgets';
import { apiService } from '../../../../services/apiService';
import LoadingSpinner from '../../../../components/LoadingSpinner';

interface WorkspaceData {
  id: string;
  workspace_name: string;
  description?: string;
  row_count: number;
  columns: string[];
  created_at: string;
}

export default function DashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params?.projectId as string;
  const analysisTypes = searchParams?.get('analyses') || undefined;
  
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkspaceData();
  }, [projectId]);

  const loadWorkspaceData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getWorkspaceData(projectId);
      setWorkspaceData({
        id: projectId,
        workspace_name: response.workspace_name,
        row_count: response.total_records,
        columns: response.columns,
        created_at: new Date().toISOString() // Mock data
      });
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar dados do workspace:', err);
      setError(err.message || 'Erro ao carregar dados do workspace');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-700">Erro ao carregar dashboard: {error}</span>
            </div>
            <button
              onClick={loadWorkspaceData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!workspaceData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-center">
              <span className="text-4xl mb-4 block">📊</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Workspace não encontrado</h3>
              <p className="text-gray-600">O workspace solicitado não foi encontrado ou não está acessível.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Visualização completa dos dados e insights
                {analysisTypes && (
                  <span className="text-blue-600 ml-2">
                    • Análises personalizadas: {analysisTypes.split(',').length} tipos
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar Dashboard
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📊</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {workspaceData.workspace_name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {workspaceData.row_count.toLocaleString()} registros • {workspaceData.columns.length} colunas
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Criado em {new Date(workspaceData.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Widgets */}
        <DashboardWidgets 
          workspaceId={projectId}
          workspaceName={workspaceData.workspace_name}
          analysisTypes={analysisTypes}
        />
      </div>
    </div>
  );
} 