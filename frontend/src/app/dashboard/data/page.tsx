"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DataPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('tables');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [workspaceName, setWorkspaceName] = useState('Espaço de trabalho - 1');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('excel');
  const [dataLocation, setDataLocation] = useState('local');
  const [tableName, setTableName] = useState('');
  const [firstRowHeaders, setFirstRowHeaders] = useState('sim');
  const [dateFormat, setDateFormat] = useState('dd MMM yyyy HH:mm:ss');
  const [errorHandling, setErrorHandling] = useState('empty');

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

  const handleImportData = () => {
    setShowImportWizard(true);
    setWizardStep(1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTableName(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const nextStep = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    }
  };

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const closeWizard = () => {
    setShowImportWizard(false);
    setWizardStep(1);
    setSelectedFile(null);
  };

  const createTable = async () => {
    try {
      if (!selectedFile) {
        throw new Error('Nenhum arquivo selecionado');
      }

      console.log('Criando tabela com:', {
        workspaceName,
        description,
        fileType,
        dataLocation,
        selectedFile,
        tableName,
        firstRowHeaders,
        dateFormat,
        errorHandling
      });

      alert('Tabela criada com sucesso!');
      closeWizard();
    } catch (error: any) {
      console.error('Failed to create table:', error);
      alert(`Erro ao criar tabela: ${error.message}`);
    }
  };

  // Empty data arrays - ready for real data
  const tables: any[] = [];
  const connections: any[] = [];

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            { id: 'explorar', label: 'Explorar', icon: 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z M3,7 12,13 21,7' },
            { id: 'data', label: 'Dados', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4', active: true },
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
                <h1 className="text-2xl font-bold text-gray-900">Dados</h1>
                <p className="text-gray-600 mt-1">Gerencie suas tabelas e conexões de dados</p>
              </div>
              <button
                onClick={handleImportData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                + Importar Dados
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
                    placeholder="Buscar tabelas, conexões..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('tables')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === 'tables'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tabelas
                </button>
                <button
                  onClick={() => setActiveTab('connections')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === 'connections'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Conexões
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'tables' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTables.map((table) => (
                <div
                  key={table.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">📊</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        table.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {table.status === 'active' ? 'Ativo' : 'Inativo'}
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
                      <span>Última modificação:</span>
                      <span className="font-medium">{new Date(table.lastModified).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">
                      {conn.type === 'mysql' ? '🐬' : 
                       conn.type === 'postgresql' ? '🐘' : '📊'}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        conn.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {conn.status === 'connected' ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{conn.name}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Tipo:</span>
                      <span className="font-medium capitalize">{conn.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tabelas:</span>
                      <span className="font-medium">{conn.tables}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Última sincronização:</span>
                      <span className="font-medium">{conn.lastSync}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {((activeTab === 'tables' && filteredTables.length === 0) || 
            (activeTab === 'connections' && filteredConnections.length === 0)) && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    {/* Database Icon */}
                    <defs>
                      <linearGradient id="dbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#1D4ED8', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <ellipse cx="12" cy="6" rx="8" ry="3" fill="url(#dbGradient)" opacity="0.8"/>
                    <path d="M4 6v8c0 1.1 3.6 2 8 2s8-.9 8-2V6" fill="url(#dbGradient)" opacity="0.6"/>
                    <ellipse cx="12" cy="14" rx="8" ry="3" fill="url(#dbGradient)" opacity="0.4"/>
                    <path d="M4 14v4c0 1.1 3.6 2 8 2s8-.9 8-2v-4" fill="url(#dbGradient)" opacity="0.2"/>
                    <ellipse cx="12" cy="22" rx="8" ry="3" fill="url(#dbGradient)" opacity="0.1"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {searchTerm ? 'Nenhum resultado encontrado' : `Nenhuma ${activeTab === 'tables' ? 'tabela' : 'conexão'} criada`}
                </h3>
                <p className="text-gray-600 mb-8 text-base">
                  {searchTerm 
                    ? 'Tente ajustar sua busca'
                    : `Comece importando dados ou criando uma ${activeTab === 'tables' ? 'tabela' : 'conexão'}`
                  }
                </p>
                <button
                  onClick={handleImportData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-base"
                >
                  Importar Dados
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

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
                    Etapa {wizardStep} de 3: Importar dados
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Importar dados para criar tabelas e conexões
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
                      Nome da Tabela*
                    </label>
                    <input
                      type="text"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o nome da tabela"
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
                      placeholder="Descreva sua tabela..."
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
                      <option value="json">JSON</option>
                      <option value="xml">XML</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selecionar arquivo*
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx,.xls,.csv,.json,.xml"
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-blue-600 hover:text-blue-500">Escolher arquivo</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedFile ? selectedFile.name : 'Nenhum arquivo selecionado'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Data Configuration */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primeira linha contém cabeçalhos
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
                      Formato de data
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="dd MMM yyyy HH:mm:ss">dd MMM yyyy HH:mm:ss</option>
                      <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                      <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                      <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tratamento de erros
                    </label>
                    <select
                      value={errorHandling}
                      onChange={(e) => setErrorHandling(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="empty">Deixar vazio</option>
                      <option value="zero">Substituir por zero</option>
                      <option value="skip">Pular linha</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Review and Import */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Resumo da importação</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Nome da tabela:</span> {tableName}</div>
                      <div><span className="font-medium">Descrição:</span> {description || 'Não informada'}</div>
                      <div><span className="font-medium">Arquivo:</span> {selectedFile?.name}</div>
                      <div><span className="font-medium">Tipo:</span> {fileType}</div>
                      <div><span className="font-medium">Cabeçalhos:</span> {firstRowHeaders === 'sim' ? 'Sim' : 'Não'}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Próximos passos</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Sua tabela será criada e os dados importados</li>
                      <li>• Você poderá visualizar e editar os dados</li>
                      <li>• A tabela ficará disponível para análises</li>
                      <li>• Você poderá criar conexões com outros sistemas</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={wizardStep === 1}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    wizardStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Anterior
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={closeWizard}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  {wizardStep === 3 ? (
                    <button
                      onClick={createTable}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Criar Tabela
                    </button>
                  ) : (
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Próximo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section - General Information */}
            <div className="w-80 bg-gray-50 p-6 border-l border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações gerais:</h3>
              
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  O tamanho dos dados deve ser inferior a 100 MB e o número de linhas deve ser inferior a 1 Milhão.
                </p>
                
                <p>
                  Para uploads maiores, use o <strong>Databridge</strong>. Os dados devem estar em formatos de texto CSV ou TSV.
                </p>
                
                <p>
                  Para suporte: <a href="mailto:support@autoreport.com" className="text-blue-600 hover:underline">support@autoreport.com</a>
                </p>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200">
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
      )}
    </div>
  );
} 