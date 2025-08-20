"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function TableDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tableId = params.id;
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      if (width < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Carregar dados do projeto (versão temporária com dados mockados)
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true);
        
        // Dados mockados temporários
        const mockData = {
          id: tableId,
          name: `Projeto ${tableId}`,
          description: 'Descrição do projeto de teste',
          rows: 1000,
          columns: 5,
          lastModified: '2024-01-01',
          createdBy: 'Usuário Teste',
          status: 'active',
          size: '2.3 MB',
          lastAccessed: '2024-01-01 14:30',
          columns: [
            { name: 'col1', type: 'text', nullable: true, description: 'Coluna 1' },
            { name: 'col2', type: 'number', nullable: false, description: 'Coluna 2' },
            { name: 'col3', type: 'date', nullable: true, description: 'Coluna 3' }
          ],
          sampleData: [
            { col1: 'valor1', col2: 100, col3: '2024-01-01' },
            { col1: 'valor2', col2: 200, col3: '2024-01-02' },
            { col1: 'valor3', col2: 300, col3: '2024-01-03' }
          ]
        };
        
        setTableData(mockData);
        console.log('✅ Dados mockados carregados:', mockData);
        
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do projeto');
      } finally {
        setLoading(false);
      }
    };

    if (tableId) {
      loadProjectData();
    }
  }, [tableId]);





  // Estado de loading
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projeto...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard/explore')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Voltar para Explorar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se não há dados
  if (!tableData) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h2>
            <p className="text-gray-600 mb-4">O projeto solicitado não foi encontrado.</p>
            <button
              onClick={() => router.push('/dashboard/explore')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Voltar para Explorar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out flex-shrink-0 shadow-lg
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
        ${isMobile && sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
        ${isMobile ? 'absolute' : 'relative'}
      `}>
        {/* Mobile Overlay */}
        {isMobile && !sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Logo/Brand Section */}
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              A
            </div>
            {!sidebarCollapsed && (
              <span className="text-base font-semibold text-white truncate">
                AutoReport
              </span>
            )}
          </div>
        </div>

        {/* Create Button */}
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-700 bg-gray-900">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full h-9 lg:h-10 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {!sidebarCollapsed && <span className="truncate">Criar</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-1 overflow-y-auto">
          {[
            { id: 'explorar', label: 'Explorar', icon: 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z M3,7 12,13 21,7' },
            { id: 'data', label: 'Dados', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
            { id: 'code-studio', label: 'Code Studio', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
            { id: 'automl', label: 'AutoML', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
            { id: 'fontes', label: 'Fontes de dados', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
            { id: 'mais', label: 'Mais', icon: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/dashboard/${item.id === 'explorar' ? 'explore' : item.id}`)}
              className={`w-full px-4 py-2.5 text-left transition-colors duration-200 flex items-center gap-3 ${
                item.active 
                  ? 'text-white bg-gray-800' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {!sidebarCollapsed && <span className="text-sm truncate">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between mb-2">
            {!sidebarCollapsed && <span className="text-xs text-gray-400 font-medium truncate">Workspace</span>}
            <div className="w-7 h-3.5 bg-green-600 rounded-full relative cursor-pointer flex-shrink-0">
              <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1.5 rounded flex-shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {!sidebarCollapsed && (
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                U
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`
        flex-1 flex flex-col min-w-0
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        ${isMobile ? 'ml-0' : ''}
        transition-all duration-300 ease-in-out
        overflow-hidden
      `}>
        {/* Main Content Area */}
        <main className={`flex-1 bg-gray-50 overflow-y-auto ${sidebarCollapsed ? 'p-6' : 'p-6 px-8'}`}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard/tables')}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{tableData.name}</h1>
                  <p className="text-gray-600 mt-1">{tableData.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push(`/dashboard/analysis/${tableId}`)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  📊 Criar Análise
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Editar Tabela
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Exportar
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === 'schema'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Schema
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === 'data'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Dados
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Linhas</p>
                      <p className="text-2xl font-bold text-gray-900">{tableData.rows.toLocaleString()}</p>
                    </div>
                    <div className="text-3xl">📊</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Colunas</p>
                      <p className="text-2xl font-bold text-gray-900">{tableData.columns.length}</p>
                    </div>
                    <div className="text-3xl">📋</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tamanho</p>
                      <p className="text-2xl font-bold text-gray-900">{tableData.size}</p>
                    </div>
                    <div className="text-3xl">💾</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <p className="text-2xl font-bold text-green-600">Ativa</p>
                    </div>
                    <div className="text-3xl">✅</div>
                  </div>
                </div>
              </div>

              {/* Table Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Tabela</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Criada por:</span>
                      <span className="font-medium">{tableData.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última modificação:</span>
                      <span className="font-medium">{new Date(tableData.lastModified).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Último acesso:</span>
                      <span className="font-medium">{tableData.lastAccessed}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID da tabela:</span>
                      <span className="font-medium">{tableData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">Tabela de dados</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Versão:</span>
                      <span className="font-medium">1.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Schema da Tabela</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coluna</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nullable</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.columns.map((column, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{column.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{column.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            column.nullable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {column.nullable ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{column.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Dados da Tabela</h3>
                <p className="text-sm text-gray-600 mt-1">Mostrando as primeiras 3 linhas de {tableData.rows.toLocaleString()} registros</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableData.columns.map((column, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.sampleData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {tableData.columns.map((column, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {row[column.name as keyof typeof row]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Table Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Editar Tabela</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Tabela
                </label>
                <input
                  type="text"
                  defaultValue={tableData.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  defaultValue={tableData.description}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 