"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024); // Mudança para 1024px (tablet)
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

  const createProject = async () => {
    try {
      if (!selectedFile) {
        throw new Error('Nenhum arquivo selecionado');
      }

      // Aqui você pode implementar a lógica de upload
      console.log('Criando projeto com:', {
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

      // Simular sucesso
      alert('Projeto criado com sucesso!');
      closeWizard();
    } catch (error: any) {
      console.error('Failed to create project:', error);
      alert(`Erro ao criar projeto: ${error.message}`);
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
            { id: 'data', label: 'Dados', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
            { id: 'code-studio', label: 'Code Studio', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
            { id: 'automl', label: 'AutoML', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
            { id: 'fontes', label: 'Fontes de dados', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
            { id: 'mais', label: 'Mais', icon: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/dashboard/${item.id === 'explorar' ? 'explore' : item.id}`)}
              className="w-full px-4 py-2.5 text-left text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3"
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
        <main className={`flex-1 bg-gray-50 min-h-screen ${sidebarCollapsed ? 'flex items-center justify-center p-4 lg:p-8' : 'flex items-center justify-center pt-16 p-4 lg:p-8 px-8'}`}>
          <div className={`w-full ${sidebarCollapsed ? 'text-center max-w-2xl mx-auto' : 'text-center max-w-4xl mx-auto'}`}>
            {/* Central Illustration */}
            <div className={`mb-8 ${sidebarCollapsed ? 'flex justify-center' : 'flex justify-center'}`}>
              <div className="relative">
                {/* Main laptop illustration */}
                <div className={`${sidebarCollapsed ? 'w-64 h-40' : 'w-96 h-56'} bg-gray-200 rounded-lg flex items-center justify-center mb-4`}>
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                
                {/* Floating icons around the laptop */}
                <div className={`absolute -top-4 -left-4 ${sidebarCollapsed ? 'w-12 h-12' : 'w-16 h-16'} bg-blue-100 rounded-full flex items-center justify-center`}>
                  <svg className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-8 h-8'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <div className={`absolute -top-4 -right-4 ${sidebarCollapsed ? 'w-12 h-12' : 'w-16 h-16'} bg-green-100 rounded-full flex items-center justify-center`}>
                  <svg className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-8 h-8'} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className={`absolute -bottom-4 -left-4 ${sidebarCollapsed ? 'w-12 h-12' : 'w-16 h-16'} bg-purple-100 rounded-full flex items-center justify-center`}>
                  <svg className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-8 h-8'} text-purple-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className={`absolute -bottom-4 -right-4 ${sidebarCollapsed ? 'w-12 h-12' : 'w-16 h-16'} bg-orange-100 rounded-full flex items-center justify-center`}>
                  <svg className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-8 h-8'} text-orange-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Importar ou adicionar dados
            </h1>

            {/* Description */}
            <p className={`text-lg text-gray-600 mb-8 mx-auto ${sidebarCollapsed ? 'max-w-lg' : 'max-w-4xl'}`}>
              Comece criando relatórios e painéis para visualizar seus dados de forma inteligente e automatizada.
            </p>

            {/* Action Button */}
            <button 
              onClick={handleImportData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Importar dados / criar nova tabela
            </button>
          </div>
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
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Localização dos dados
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="dataLocation"
                            value="local"
                            checked={dataLocation === 'local'}
                            onChange={(e) => setDataLocation(e.target.value)}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Unidade local</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="dataLocation"
                            value="pasted"
                            checked={dataLocation === 'pasted'}
                            onChange={(e) => setDataLocation(e.target.value)}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Dados colados</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="dataLocation"
                            value="ftp"
                            checked={dataLocation === 'ftp'}
                            onChange={(e) => setDataLocation(e.target.value)}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">FTP</span>
                        </label>
                      </div>
                    </div>

                    {dataLocation === 'local' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Arquivo*
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".xlsx,.xls,.csv,.html,.xml,.json"
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
                        <p className="text-xs text-gray-500 mt-2">
                          (Formatos de arquivo suportados: arquivos .XLS e .XLSX)
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          <a href="#" className="hover:underline">Experimente uma amostra</a>
                        </p>
                      </div>
                    )}

                    {dataLocation === 'pasted' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dados colados*
                        </label>
                        <textarea
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Cole seus dados aqui..."
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Cole dados de planilhas ou arquivos CSV
                        </p>
                      </div>
                    )}

                    {dataLocation === 'ftp' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Servidor FTP
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ftp.exemplo.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Usuário
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="usuário"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="senha"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Caminho do arquivo
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="/caminho/para/arquivo.xlsx"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Data Configuration */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da tabela
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
                        <div><span className="font-medium">Workspace:</span> {workspaceName}</div>
                        <div><span className="font-medium">Descrição:</span> {description || 'Não informada'}</div>
                        <div><span className="font-medium">Arquivo:</span> {selectedFile?.name}</div>
                        <div><span className="font-medium">Tipo:</span> {fileType}</div>
                        <div><span className="font-medium">Tabela:</span> {tableName}</div>
                        <div><span className="font-medium">Cabeçalhos:</span> {firstRowHeaders === 'sim' ? 'Sim' : 'Não'}</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Próximos passos</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Seus dados serão processados e analisados</li>
                        <li>• Gráficos e visualizações serão criados automaticamente</li>
                        <li>• Você poderá personalizar relatórios e dashboards</li>
                        <li>• Dados ficarão disponíveis para análise avançada</li>
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
                        onClick={createProject}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        Criar Projeto
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
    </div>
  );
} 