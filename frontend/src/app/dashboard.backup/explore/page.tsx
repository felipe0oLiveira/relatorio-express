"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService } from '../../../services/apiService';
import { useAuth } from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { debugAuth } from '../../../utils/debugAuth';

const ExplorePage = React.memo(function ExplorePage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboards');
  const [searchTerm, setSearchTerm] = useState('');

  // Responsive detection - optimized with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkMobile = () => {
      const width = window.innerWidth;
      const newIsMobile = width < 1024;
      
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setSidebarCollapsed(newIsMobile);
      }
    };

    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    checkMobile();
    window.addEventListener('resize', debouncedCheckMobile);
    return () => {
      window.removeEventListener('resize', debouncedCheckMobile);
      clearTimeout(timeoutId);
    };
  }, [isMobile]);

  const [showImportWizard, setShowImportWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [workspaceName, setWorkspaceName] = useState('Espaço de trabalho - 1');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('excel');
  const [dataLocation, setDataLocation] = useState('local');
  const [selectedSheet, setSelectedSheet] = useState('Data Sales Adidas');
  const [importHiddenRows, setImportHiddenRows] = useState(false);
  const [importHiddenColumns, setImportHiddenColumns] = useState(false);
  const [tableName, setTableName] = useState('Data Sales Adidas');
  const [firstRowHeaders, setFirstRowHeaders] = useState('sim');
  const [dateFormat, setDateFormat] = useState('dd MMM yyyy HH:mm:ss');
  const [errorHandling, setErrorHandling] = useState('empty');

  // Estados para gerenciar seleção de colunas
  const [selectedColumns, setSelectedColumns] = useState({
    retailer: true,
    retailerId: true,
    invoiceDate: true,
    region: true,
    state: true
  });

  const handleColumnToggle = useCallback((columnName: string) => {
    setSelectedColumns(prev => ({
      ...prev,
      [columnName]: !prev[columnName as keyof typeof prev]
    }));
  }, []);

  const handleImportData = useCallback(() => {
    setShowImportWizard(true);
    setWizardStep(1);
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTableName(file.name.replace(/\.[^/.]+$/, ''));
    }
  }, []);

  const nextStep = useCallback(() => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    }
  }, [wizardStep]);

  const prevStep = useCallback(() => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  }, [wizardStep]);

  const closeWizard = useCallback(() => {
    setShowImportWizard(false);
    setWizardStep(1);
    setSelectedFile(null);
  }, []);

  const createProject = useCallback(async () => {
    try {
      if (!selectedFile) {
        throw new Error('Nenhum arquivo selecionado');
      }

      // Upload do arquivo
      const uploadResponse = await apiService.uploadFile(selectedFile, {
        workspace_name: workspaceName,
        description,
        file_type: fileType,
        data_location: dataLocation,
        table_name: tableName,
        first_row_headers: firstRowHeaders === 'sim',
        date_format: dateFormat,
        error_handling: errorHandling
      });

      console.log('Project created successfully:', uploadResponse);
      closeWizard();
      
      // Recarregar dados
      const [reportsData, templatesData, workspacesData] = await Promise.all([
        apiService.getReports(),
        apiService.getTemplates(),
        apiService.getWorkspaces()
      ]);
      
      setReports(reportsData || []);
      setDashboards(templatesData || []);
      setWorkspaces(workspacesData?.workspaces || []);
      
    } catch (error: any) {
      console.error('Failed to create project:', error);
      alert(`Erro ao criar projeto: ${error.message}`);
    }
  }, [workspaceName, description, fileType, dataLocation, selectedFile, tableName, firstRowHeaders, dateFormat, errorHandling, closeWizard]);

  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingReport, setDeletingReport] = useState<string | null>(null);

  // Função para deletar relatório ou workspace
  const handleDeleteReport = async (itemId: string, itemName: string, isWorkspace: boolean = false) => {
    const itemType = isWorkspace ? 'workspace' : 'relatório';
    
    if (!confirm(`Tem certeza que deseja excluir o ${itemType} "${itemName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      setDeletingReport(itemId);
      
      console.log('🗑️ Tentando deletar item:', { itemId, itemName, isWorkspace });
      
      // Verificar se o item existe na lista local
      const itemExists = isWorkspace 
        ? workspaces.find(w => w.id === itemId)
        : reports.find(r => r.id === itemId);
      console.log('🔍 Item encontrado na lista local:', itemExists);
      
      // Verificar se há token antes de tentar deletar
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }
      
      console.log('🔑 Token presente, tentando deletar item ID:', itemId);
      
      if (isWorkspace) {
        await apiService.deleteWorkspace(itemId);
        
        // Remover o workspace da lista local
        setWorkspaces(prevWorkspaces => prevWorkspaces.filter(workspace => workspace.id !== itemId));
      } else {
        // Para relatórios, converter para número se necessário
        const numericId = parseInt(itemId, 10);
        if (isNaN(numericId)) {
          throw new Error('ID do relatório inválido');
        }
        await apiService.deleteReport(numericId.toString());
        
        // Remover o relatório da lista local
        setReports(prevReports => prevReports.filter(report => report.id !== itemId));
      }
      
      // Mostrar mensagem de sucesso
      alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} excluído com sucesso!`);
    } catch (error: any) {
      console.error(`Erro ao excluir ${itemType}:`, error);
      
      // Melhorar a mensagem de erro
      let errorMessage = 'Erro desconhecido';
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      alert(`Erro ao excluir ${itemType}: ${errorMessage}`);
    } finally {
      setDeletingReport(null);
    }
  };

  // Carregar dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Iniciando carregamento de dados...');
        console.log('👤 Usuário:', user);
        
        // Debug de autenticação
        debugAuth();
        
        setIsLoading(true);
        
        // Verificar se há token
        const token = localStorage.getItem('access_token');
        console.log('🔑 Token presente:', !!token);
        
        // Testar endpoint de workspaces primeiro
        console.log('🧪 Testando endpoint de workspaces...');
        try {
          const testResult = await apiService.testWorkspaces();
          console.log('✅ Teste de workspaces:', testResult);
        } catch (testError) {
          console.error('❌ Erro no teste de workspaces:', testError);
        }

        const [reportsData, templatesData, workspacesData] = await Promise.all([
          apiService.getReports().catch(err => {
            console.error('❌ Erro ao carregar reports:', err);
            return [];
          }),
          apiService.getTemplates().catch(err => {
            console.error('❌ Erro ao carregar templates:', err);
            return [];
          }),
          apiService.getWorkspaces().catch(err => {
            console.error('❌ Erro ao carregar workspaces:', err);
            return { workspaces: [] };
          })
        ]);
        
        console.log('📊 Dados carregados:', {
          reports: reportsData?.length || 0,
          templates: templatesData?.length || 0,
          workspaces: workspacesData?.workspaces?.length || 0
        });
        
        setReports(reportsData || []);
        setDashboards(templatesData || []);
        setWorkspaces(workspacesData?.workspaces || []);
      } catch (error) {
        console.error('❌ Erro geral ao carregar dados:', error);
        // Em caso de erro, manter arrays vazios
        setReports([]);
        setDashboards([]);
        setWorkspaces([]);
      } finally {
        console.log('✅ Carregamento finalizado');
        setIsLoading(false);
      }
    };

    // Carregar dados se houver usuário OU se houver token (para casos onde o usuário ainda não foi carregado)
    const token = localStorage.getItem('access_token');
    if (user || token) {
      loadData();
    } else {
      console.log('⚠️ Usuário não autenticado e sem token');
      setIsLoading(false);
    }
  }, [user]);

  const filteredItems = useMemo(() => {
    const allItems = [...dashboards, ...reports, ...workspaces];
    if (!searchTerm) return allItems;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allItems.filter(item =>
      item.name?.toLowerCase().includes(lowerSearchTerm) ||
      item.description?.toLowerCase().includes(lowerSearchTerm) ||
      item.workspace_name?.toLowerCase().includes(lowerSearchTerm) ||
      item.table_name?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [dashboards, reports, workspaces, searchTerm]);

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
            onClick={handleImportData}
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
            { id: 'explorar', label: 'Explorar', icon: 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z M3,7 12,13 21,7', active: true },
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
                <h1 className="text-2xl font-bold text-gray-900">Explorar</h1>
                <p className="text-gray-600 mt-1">Descubra e visualize seus dados</p>
              </div>
              <button
                onClick={handleImportData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                + Novo Dashboard
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar dashboards, relatórios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('dashboards')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === 'dashboards'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Dashboards
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === 'reports'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Relatórios
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600">Carregando dados...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 relative group"
              >
                {/* Botão de Delete */}
                {item.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isWorkspace = !!item.workspace_name;
                      console.log('🗑️ Clicou em deletar item:', {
                        id: item.id,
                        type: item.type,
                        name: item.name || item.workspace_name || item.table_name,
                        isWorkspace
                      });
                      handleDeleteReport(item.id, item.name || item.workspace_name || item.table_name, isWorkspace);
                    }}
                    disabled={deletingReport === item.id}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title={item.workspace_name ? "Excluir workspace" : "Excluir relatório"}
                  >
                    {deletingReport === item.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
                
                <div
                  onClick={() => {
                    // Navegar para a página de seleção de análises do projeto
                    if (item.id) {
                      router.push(`/dashboard/analysis/${item.id}`);
                    } else if (item.workspace_name) {
                      // Para workspaces, usar o nome como identificador
                      router.push(`/dashboard/analysis/${encodeURIComponent(item.workspace_name)}`);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">
                    {item.thumbnail || (
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.type === 'dashboard' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'report' ? 'bg-green-100 text-green-800' :
                      item.workspace_name ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type === 'dashboard' ? 'Dashboard' :
                       item.type === 'report' ? 'Relatório' :
                       item.workspace_name ? 'Workspace' : 'Análise'}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.name || item.workspace_name || item.table_name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description || `Tabela: ${item.table_name}`}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {item.row_count ? `${item.row_count} linhas` : 
                     item.createdBy ? `Por ${item.createdBy}` : 'Projeto'}
                  </span>
                  <span>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') :
                     item.lastModified ? new Date(item.lastModified).toLocaleDateString('pt-BR') : 
                     'Recente'}
                  </span>
                </div>
                </div>
              </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    {/* Dashboard/Chart Icon */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#1D4ED8', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <rect x="3" y="12" width="2" height="8" fill="url(#chartGradient)" rx="1"/>
                    <rect x="7" y="8" width="2" height="12" fill="url(#chartGradient)" rx="1"/>
                    <rect x="11" y="6" width="2" height="14" fill="url(#chartGradient)" rx="1"/>
                    <rect x="15" y="10" width="2" height="10" fill="url(#chartGradient)" rx="1"/>
                    <rect x="19" y="4" width="2" height="16" fill="url(#chartGradient)" rx="1"/>
                    <path d="M3 20h18" stroke="#1E40AF" strokeWidth="1" opacity="0.5"/>
                    <path d="M3 4h18" stroke="#1E40AF" strokeWidth="1" opacity="0.5"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum dashboard criado'}
                </h3>
                <p className="text-gray-600 mb-8 text-base">
                  {searchTerm 
                    ? 'Tente ajustar sua busca ou criar um novo dashboard'
                    : 'Comece criando seu primeiro dashboard para visualizar seus dados'
                  }
                </p>
                                 <button
                   onClick={handleImportData}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-base"
                 >
                   Criar Primeiro Projeto
                 </button>
              </div>
            </div>
          )}
        </main>

        {/* Import Wizard Modal */}
        {showImportWizard && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-8">
            <div className="bg-white rounded-lg w-full max-w-5xl h-[80vh] flex overflow-hidden shadow-2xl">
            {/* Left Section - Wizard Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Etapa {wizardStep} de 3: Importar seus dados
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Importar dados de arquivos do Excel, CSV, HTML, XML, JSON, arquivos do Statistical e do MS Access
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button onClick={closeWizard} className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Step 1: File Selection */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Espaço de Trabalho*
                      <svg className="w-4 h-4 inline ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </label>
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descreva seu projeto..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de arquivo
                    </label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                      <option value="html">HTML</option>
                      <option value="xml">XML</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localização dos dados
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="local"
                          checked={dataLocation === 'local'}
                          onChange={(e) => setDataLocation(e.target.value)}
                          className="mr-2"
                        />
                        Unidade local
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="pasted"
                          checked={dataLocation === 'pasted'}
                          onChange={(e) => setDataLocation(e.target.value)}
                          className="mr-2"
                        />
                        Dados colados
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="ftp"
                          checked={dataLocation === 'ftp'}
                          onChange={(e) => setDataLocation(e.target.value)}
                          className="mr-2"
                        />
                        FTP
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arquivo*
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx,.xls,.csv,.html,.xml,.json"
                        className="hidden"
                        id="fileInput"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                          if (fileInput) {
                            fileInput.click();
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white cursor-pointer"
                      >
                        Escolher arquivo
                      </button>
                      <span className="text-gray-600">
                        {selectedFile ? selectedFile.name : 'Nenhum arquivo selecionado'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      (Formatos de arquivo suportados: arquivos .XLS e .XLSX)
                    </p>
                    <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">
                      Experimente uma amostra
                    </a>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Nota:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Para outros formatos de arquivo, escolha acima a opção correspondente do "Tipo de Arquivo".</li>
                      <li>• Para arquivo XLS de tamanho grande, nós recomendamos zipar e depois fazer o upload.</li>
                      <li>• O arquivo XLS zipado pode conter apenas um arquivo.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 2: Sheet Selection and Preview */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selecione o Folhas para ser importado: (Primeiras quatro linhas listadas de cada folha)
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSheet === 'Data Sales Adidas'}
                          onChange={() => setSelectedSheet('Data Sales Adidas')}
                          className="mr-2"
                        />
                        Data Sales Adidas
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Visualização da data (5 primeiras linhas exibidas)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Retailer</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Retailer ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Invoice Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Region</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">State</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">City</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Product</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Price per Unit</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Units Sold</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Total Sales</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Operating Profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 text-sm">Foot Locker</td>
                            <td className="px-4 py-2 text-sm">1185732</td>
                            <td className="px-4 py-2 text-sm">01 Jan 2020 00:00:00</td>
                            <td className="px-4 py-2 text-sm">Northeast</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                            <td className="px-4 py-2 text-sm">Men's Street Footwear</td>
                            <td className="px-4 py-2 text-sm">$50.00</td>
                            <td className="px-4 py-2 text-sm">1,200</td>
                            <td className="px-4 py-2 text-sm">$600,000</td>
                            <td className="px-4 py-2 text-sm">$300,000</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Foot Locker</td>
                            <td className="px-4 py-2 text-sm">1185732</td>
                            <td className="px-4 py-2 text-sm">02 Jan 2020 00:00:00</td>
                            <td className="px-4 py-2 text-sm">Northeast</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                            <td className="px-4 py-2 text-sm">Men's Athletic Footwear</td>
                            <td className="px-4 py-2 text-sm">$50.00</td>
                            <td className="px-4 py-2 text-sm">1,000</td>
                            <td className="px-4 py-2 text-sm">$500,000</td>
                            <td className="px-4 py-2 text-sm">$150,000</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Foot Locker</td>
                            <td className="px-4 py-2 text-sm">1185732</td>
                            <td className="px-4 py-2 text-sm">06 Jan 2020 00:00:00</td>
                            <td className="px-4 py-2 text-sm">Northeast</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                            <td className="px-4 py-2 text-sm">Women's Apparel</td>
                            <td className="px-4 py-2 text-sm">$50.00</td>
                            <td className="px-4 py-2 text-sm">1,000</td>
                            <td className="px-4 py-2 text-sm">$500,000</td>
                            <td className="px-4 py-2 text-sm">$125,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Importar colunas/linhas ocultas:
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={importHiddenRows}
                          onChange={(e) => setImportHiddenRows(e.target.checked)}
                          className="mr-2"
                        />
                        Importar linhas ocultas
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={importHiddenColumns}
                          onChange={(e) => setImportHiddenColumns(e.target.checked)}
                          className="mr-2"
                        />
                        Importar colunas ocultas
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Configuration */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da tabela
                      <svg className="w-4 h-4 inline ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </label>
                    <input
                      type="text"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      A primeira linha contém os nomes de coluna?
                    </label>
                    <select
                      value={firstRowHeaders}
                      onChange={(e) => setFirstRowHeaders(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato da(s) coluna(s) de data(s)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">24 Nov 2014 22:47:59</span>
                      <span className="text-sm text-gray-500">(dd MMM yyyy HH:mm:ss)</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Mais Configurações
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Visualização da data (5 primeiras linhas exibidas)</h4>
                    <div className="flex items-center gap-4 mb-4">
                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Exibir qualidade de dados
                      </button>
                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Preparar dados
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              <input 
                                type="checkbox" 
                                checked={selectedColumns.retailer}
                                onChange={() => handleColumnToggle('retailer')}
                                className="mr-2" 
                              />
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Retailer
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              <input 
                                type="checkbox" 
                                checked={selectedColumns.retailerId}
                                onChange={() => handleColumnToggle('retailerId')}
                                className="mr-2" 
                              />
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Retailer ID
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              <input 
                                type="checkbox" 
                                checked={selectedColumns.invoiceDate}
                                onChange={() => handleColumnToggle('invoiceDate')}
                                className="mr-2" 
                              />
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Invoice Date
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              <input 
                                type="checkbox" 
                                checked={selectedColumns.region}
                                onChange={() => handleColumnToggle('region')}
                                className="mr-2" 
                              />
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Region
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              <input 
                                type="checkbox" 
                                checked={selectedColumns.state}
                                onChange={() => handleColumnToggle('state')}
                                className="mr-2" 
                              />
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              State
                              <svg className="w-4 h-4 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 text-sm">Foot Locker</td>
                            <td className="px-4 py-2 text-sm">1185732</td>
                            <td className="px-4 py-2 text-sm">01 Jan 2020 00:00:00</td>
                            <td className="px-4 py-2 text-sm">Northeast</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Foot Locker</td>
                            <td className="px-4 py-2 text-sm">1185732</td>
                            <td className="px-4 py-2 text-sm">02 Jan 2020 00:00:00</td>
                            <td className="px-4 py-2 text-sm">Northeast</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Foot Locker</td>
                            <td className="px-4 py-2 text-sm">1185732</td>
                            <td className="px-4 py-2 text-sm">03 Jan 2020 00:00:00</td>
                            <td className="px-4 py-2 text-sm">Northeast</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Foot Locker</td>
                            <td className="px-4 py-2 text-sm">1185732</td>
                            <td className="px-4 py-2 text-sm">04 Jan 2020 00:00:00</td>
                            <td className="px-4 py-2 text-sm">Northeast</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Foot Locker</td>
                            <td className="px-4 py-2 text-sm">1185732</td>
                            <td className="px-4 py-2 text-sm">05 Jan 2020 00:00:00</td>
                            <td className="px-4 py-2 text-sm">Northeast</td>
                            <td className="px-4 py-2 text-sm">New York</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      * Clique na célula do cabeçalho para editar os nomes de colunas
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ao ocorrer erros de importação
                    </label>
                    <select
                      value={errorHandling}
                      onChange={(e) => setErrorHandling(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="empty">Configure o valor vazio para a célula</option>
                      <option value="skip">Pular a linha</option>
                      <option value="stop">Parar a importação</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={closeWizard}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  {wizardStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Anterior
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  {wizardStep < 3 ? (
                    <button
                      onClick={nextStep}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Próximo
                    </button>
                  ) : (
                    <button
                      onClick={createProject}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Criar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section - General Information */}
            <div className="w-80 bg-gray-50 p-6 border-l border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Informações gerais:</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  O tamanho dos dados deve ser inferior a 100 MB e o número de linhas deve inferior a 1 Milhão
                </p>
                <p>
                  Para fazer mais uploads, use nosso <a href="#" className="text-blue-600 hover:text-blue-700">Databridge</a>, dado que seus dados estejam nos formatos de arquivo de texto CSV ou TSV
                </p>
                <p>
                  Entre em contato com <a href="mailto:support@zohoanalytics.com" className="text-blue-600 hover:text-blue-700">support@zohoanalytics.com</a> para receber assistência
                </p>
                <div className="flex gap-4 pt-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
       </div>
     </div>
   );
});

export default ExplorePage; 