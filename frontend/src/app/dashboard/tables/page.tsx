"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TablesPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleCreateTable = () => {
    setShowCreateModal(true);
  };

  const handleTableClick = (tableId: number) => {
    router.push(`/dashboard/tables/${tableId}`);
  };

  // Mock data
  const tables = [
    {
      id: 1,
      name: 'Vendas_2024',
      description: 'Dados de vendas do ano de 2024',
      rows: 15420,
      columns: 12,
      lastModified: '2024-01-15',
      createdBy: 'João Silva',
      status: 'active',
      size: '2.3 MB',
      lastAccessed: '2024-01-15 14:30'
    },
    {
      id: 2,
      name: 'Clientes_Cadastro',
      description: 'Cadastro completo de clientes',
      rows: 8540,
      columns: 8,
      lastModified: '2024-01-12',
      createdBy: 'Maria Santos',
      status: 'active',
      size: '1.8 MB',
      lastAccessed: '2024-01-15 12:15'
    },
    {
      id: 3,
      name: 'Produtos_Catalogo',
      description: 'Catálogo de produtos e preços',
      rows: 2340,
      columns: 15,
      lastModified: '2024-01-10',
      createdBy: 'Pedro Costa',
      status: 'active',
      size: '0.9 MB',
      lastAccessed: '2024-01-14 09:45'
    },
    {
      id: 4,
      name: 'Funcionarios_RH',
      description: 'Dados de funcionários do RH',
      rows: 1250,
      columns: 10,
      lastModified: '2024-01-08',
      createdBy: 'Ana Oliveira',
      status: 'archived',
      size: '0.5 MB',
      lastAccessed: '2024-01-10 16:20'
    },
    {
      id: 5,
      name: 'Financeiro_2023',
      description: 'Dados financeiros de 2023',
      rows: 8900,
      columns: 18,
      lastModified: '2024-01-05',
      createdBy: 'Carlos Lima',
      status: 'active',
      size: '3.2 MB',
      lastAccessed: '2024-01-15 11:30'
    }
  ];

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'archived':
        return 'Arquivada';
      case 'processing':
        return 'Processando';
      default:
        return 'Erro';
    }
  };

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
            onClick={handleCreateTable}
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tabelas</h1>
                <p className="text-gray-600 mt-1">Gerencie suas tabelas de dados</p>
              </div>
              <button
                onClick={handleCreateTable}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                + Nova Tabela
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="max-w-md">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar tabelas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                onClick={() => handleTableClick(table.id)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">📊</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(table.status)}`}>
                      {getStatusText(table.status)}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{table.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{table.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Linhas:</span>
                    <span className="font-medium">{table.rows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Colunas:</span>
                    <span className="font-medium">{table.columns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamanho:</span>
                    <span className="font-medium">{table.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Por:</span>
                    <span className="font-medium">{table.createdBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Último acesso:</span>
                    <span className="font-medium">{table.lastAccessed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Última modificação:</span>
                    <span className="font-medium">{new Date(table.lastModified).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTables.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma tabela encontrada' : 'Nenhuma tabela criada'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Tente ajustar sua busca'
                  : 'Comece criando sua primeira tabela para organizar seus dados'
                }
              </p>
              <button
                onClick={handleCreateTable}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Criar Primeira Tabela
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Create Table Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Criar Nova Tabela</h3>
              <button
                onClick={() => setShowCreateModal(false)}
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
                  placeholder="Digite o nome da tabela"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva o propósito da tabela..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Criação
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Importar dados</option>
                  <option>Criar manualmente</option>
                  <option>Conectar banco de dados</option>
                  <option>API externa</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Criar Tabela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 