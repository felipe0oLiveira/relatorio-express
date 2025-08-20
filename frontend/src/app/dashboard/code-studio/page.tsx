"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CodeStudioPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('scripts');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewScriptModal, setShowNewScriptModal] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [code, setCode] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [scriptDescription, setScriptDescription] = useState('');
  const [scriptType, setScriptType] = useState('python');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

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

  const handleCreateScript = () => {
    setShowNewScriptModal(true);
  };

  const handleOpenEditor = (script: any) => {
    setSelectedScript(script);
    setCode(script.code || '');
    setShowCodeEditor(true);
  };

  const handleSaveScript = () => {
    if (!scriptName.trim()) {
      alert('Por favor, insira um nome para o script');
      return;
    }

    const newScript = {
      id: Date.now(),
      name: scriptName,
      description: scriptDescription,
      type: scriptType,
      code: code,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Salvando script:', newScript);
    alert('Script salvo com sucesso!');
    setShowCodeEditor(false);
    setShowNewScriptModal(false);
    setScriptName('');
    setScriptDescription('');
    setCode('');
  };

  const handleRunScript = async () => {
    setIsRunning(true);
    setOutput('Executando script...\n');
    
    // Simulate script execution
    setTimeout(() => {
      setOutput(prev => prev + 'Script executado com sucesso!\nResultado: Dados processados e analisados.\n');
      setIsRunning(false);
    }, 2000);
  };

  // Empty data arrays - ready for real data
  const scripts: any[] = [];
  const templates: any[] = [];

  const filteredScripts = scripts.filter(script =>
    script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            onClick={handleCreateScript}
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
            { id: 'code-studio', label: 'Code Studio', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', active: true },
            { id: 'automl', label: 'AutoML', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
            { id: 'fontes', label: 'Fontes de dados', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
            { id: 'mais', label: 'Mais', icon: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' }
          ].map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/${item.id === 'explorar' ? 'explore' : item.id}`}
              className={`
                flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-800
                ${item.active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'}
              `}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Workspace Switch */}
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-t border-gray-700 bg-gray-900">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Workspace</span>
              <button className="text-xs text-gray-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              U
            </div>
            {!sidebarCollapsed && (
              <span className="text-sm text-white truncate">Usuário</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 ease-in-out`}>
        <main className={`flex-1 overflow-auto ${sidebarCollapsed ? 'max-w-[calc(100vw-4rem)]' : 'max-w-[calc(100vw-16rem)]'} mx-auto`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Code Studio</h1>
                <p className="text-gray-600 mt-1">Desenvolva e execute scripts de análise de dados</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {[
                { id: 'scripts', label: 'Scripts' },
                { id: 'templates', label: 'Templates' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Actions */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={`Buscar ${activeTab === 'scripts' ? 'scripts' : 'templates'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'scripts' && (
              <div className="grid gap-4">
                {filteredScripts.map((script) => (
                  <div key={script.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{script.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{script.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Tipo: {script.type}</span>
                          <span>Criado: {new Date(script.created_at).toLocaleDateString()}</span>
                          <span>Atualizado: {new Date(script.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditor(script)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                        >
                          Editar
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors duration-200">
                          Executar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="grid gap-4">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Categoria: {template.category}</span>
                          <span>Downloads: {template.downloads}</span>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200">
                        Usar Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {((activeTab === 'scripts' && filteredScripts.length === 0) || 
              (activeTab === 'templates' && filteredTemplates.length === 0)) && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                  <div className="mb-6">
                    <svg className="w-24 h-24 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      {/* Code Editor Icon */}
                      <defs>
                        <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#1D4ED8', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="url(#codeGradient)" opacity="0.1"/>
                      <path d="M8 12l2 2 6-6" stroke="url(#codeGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M9 6l6 6" stroke="url(#codeGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M15 6l-6 6" stroke="url(#codeGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {searchTerm ? 'Nenhum resultado encontrado' : `Nenhum ${activeTab === 'scripts' ? 'script' : 'template'} criado`}
                  </h3>
                  <p className="text-gray-600 mb-8 text-base">
                    {searchTerm 
                      ? 'Tente ajustar sua busca'
                      : `Comece criando seu primeiro ${activeTab === 'scripts' ? 'script' : 'template'}`
                    }
                  </p>
                  <button
                    onClick={handleCreateScript}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-base"
                  >
                    Criar Script
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New Script Modal */}
      {showNewScriptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Novo Script</h3>
              <button
                onClick={() => setShowNewScriptModal(false)}
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
                  Nome do Script
                </label>
                <input
                  type="text"
                  value={scriptName}
                  onChange={(e) => setScriptName(e.target.value)}
                  placeholder="Digite o nome do script"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={scriptDescription}
                  onChange={(e) => setScriptDescription(e.target.value)}
                  rows={3}
                  placeholder="Descreva o que o script faz..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Linguagem
                </label>
                <select
                  value={scriptType}
                  onChange={(e) => setScriptType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="sql">SQL</option>
                  <option value="r">R</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewScriptModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowNewScriptModal(false);
                  setShowCodeEditor(true);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Criar e Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Editor Modal */}
      {showCodeEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedScript ? `Editando: ${selectedScript.name}` : `Novo Script: ${scriptName}`}
                </h3>
                <p className="text-sm text-gray-600">Editor de código</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunScript}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isRunning
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isRunning ? 'Executando...' : 'Executar'}
                </button>
                <button
                  onClick={handleSaveScript}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setShowCodeEditor(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Editor and Output */}
            <div className="flex-1 flex">
              {/* Code Editor */}
              <div className="flex-1 p-4">
                <div className="bg-gray-900 rounded-lg p-4 h-full">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`// Digite seu código ${scriptType} aqui...\n\n`}
                    className="w-full h-full bg-transparent text-gray-100 font-mono text-sm resize-none outline-none"
                    style={{ lineHeight: '1.5' }}
                  />
                </div>
              </div>

              {/* Output Panel */}
              <div className="w-80 border-l border-gray-200 bg-gray-50">
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Output</h4>
                  <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
                    <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap">
                      {output || 'Nenhuma saída ainda...'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 