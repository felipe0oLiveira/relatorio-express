"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FontesPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('connections');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewConnectionModal, setShowNewConnectionModal] = useState(false);
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [connectionName, setConnectionName] = useState('');
  const [connectionType, setConnectionType] = useState('database');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [database, setDatabase] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

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

  const handleCreateConnection = () => {
    setShowNewConnectionModal(true);
  };

  const handleTestConnection = async () => {
    if (!host || !database || !username || !password) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsTesting(true);
    setTestResult('Testando conexão...');

    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      if (success) {
        setTestResult('✅ Conexão bem-sucedida!');
      } else {
        setTestResult('❌ Falha na conexão. Verifique as credenciais.');
      }
      setIsTesting(false);
    }, 2000);
  };

  const handleSaveConnection = async () => {
    if (!connectionName.trim() || !host || !database || !username || !password) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newConnection = {
      id: Date.now(),
      name: connectionName,
      type: connectionType,
      host,
      port: port || '3306',
      database,
      username,
      status: 'active',
      created_at: new Date().toISOString(),
      last_sync: new Date().toISOString()
    };

    console.log('Salvando conexão:', newConnection);
    alert('Conexão salva com sucesso!');
    setShowNewConnectionModal(false);
    resetForm();
  };

  const resetForm = () => {
    setConnectionName('');
    setConnectionType('database');
    setHost('');
    setPort('');
    setDatabase('');
    setUsername('');
    setPassword('');
    setTestResult('');
  };

  const handleViewConnection = (connection: any) => {
    setSelectedConnection(connection);
    setShowConnectionDetails(true);
  };

  // Empty data arrays - ready for real data
  const connections: any[] = [];
  const apis: any[] = [];

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.host.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApis = apis.filter(api =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            onClick={handleCreateConnection}
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
            { id: 'fontes', label: 'Fontes de dados', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4', active: true },
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
                <h1 className="text-2xl font-bold text-gray-900">Fontes de Dados</h1>
                <p className="text-gray-600 mt-1">Conecte e gerencie suas fontes de dados</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {[
                { id: 'connections', label: 'Conexões' },
                { id: 'apis', label: 'APIs' }
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
                    placeholder={`Buscar ${activeTab === 'connections' ? 'conexões' : 'APIs'}...`}
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
            {activeTab === 'connections' && (
              <div className="grid gap-4">
                {filteredConnections.map((connection) => (
                  <div key={connection.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{connection.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{connection.host}:{connection.port}/{connection.database}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Tipo: {connection.type}</span>
                          <span>Status: {connection.status}</span>
                          <span>Última sincronização: {new Date(connection.last_sync).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewConnection(connection)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                        >
                          Ver Detalhes
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors duration-200">
                          Testar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'apis' && (
              <div className="grid gap-4">
                {filteredApis.map((api) => (
                  <div key={api.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{api.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{api.url}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Tipo: {api.type}</span>
                          <span>Status: {api.status}</span>
                          <span>Última verificação: {new Date(api.last_check).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200">
                          Configurar
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors duration-200">
                          Testar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {((activeTab === 'connections' && filteredConnections.length === 0) || 
              (activeTab === 'apis' && filteredApis.length === 0)) && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                  <div className="mb-6">
                    <svg className="w-24 h-24 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      {/* Connection Icon */}
                      <defs>
                        <linearGradient id="connGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#1D4ED8', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      <circle cx="12" cy="12" r="10" fill="url(#connGradient)" opacity="0.1"/>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" 
                            stroke="url(#connGradient)" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="3" fill="url(#connGradient)" opacity="0.8"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {searchTerm ? 'Nenhum resultado encontrado' : `Nenhuma ${activeTab === 'connections' ? 'conexão' : 'API'} criada`}
                  </h3>
                  <p className="text-gray-600 mb-8 text-base">
                    {searchTerm 
                      ? 'Tente ajustar sua busca'
                      : `Comece criando sua primeira ${activeTab === 'connections' ? 'conexão' : 'API'}`
                    }
                  </p>
                  <button
                    onClick={handleCreateConnection}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-base"
                  >
                    Criar Conexão
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New Connection Modal */}
      {showNewConnectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nova Conexão</h3>
              <button
                onClick={() => setShowNewConnectionModal(false)}
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
                  Nome da Conexão*
                </label>
                <input
                  type="text"
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                  placeholder="Digite o nome da conexão"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conexão*
                </label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="database">Banco de Dados</option>
                  <option value="api">API REST</option>
                  <option value="file">Arquivo</option>
                  <option value="cloud">Serviço em Nuvem</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Host/URL*
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="localhost ou exemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Porta
                  </label>
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="3306"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banco de Dados*
                </label>
                <input
                  type="text"
                  value={database}
                  onChange={(e) => setDatabase(e.target.value)}
                  placeholder="Nome do banco de dados"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuário*
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nome do usuário"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha*
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {testResult && (
                <div className={`p-3 rounded-lg text-sm ${
                  testResult.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {testResult}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewConnectionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isTesting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {isTesting ? 'Testando...' : 'Testar Conexão'}
              </button>
              <button
                onClick={handleSaveConnection}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Salvar Conexão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Details Modal */}
      {showConnectionDetails && selectedConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Detalhes da Conexão</h3>
              <button
                onClick={() => setShowConnectionDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Informações Gerais</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Nome:</span> {selectedConnection.name}</div>
                  <div><span className="font-medium">Tipo:</span> {selectedConnection.type}</div>
                  <div><span className="font-medium">Host:</span> {selectedConnection.host}</div>
                  <div><span className="font-medium">Porta:</span> {selectedConnection.port}</div>
                  <div><span className="font-medium">Database:</span> {selectedConnection.database}</div>
                  <div><span className="font-medium">Status:</span> {selectedConnection.status}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Estatísticas</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Tabelas sincronizadas:</span> {selectedConnection.tables || 0}</div>
                  <div><span className="font-medium">Última sincronização:</span> {new Date(selectedConnection.last_sync).toLocaleString()}</div>
                  <div><span className="font-medium">Tempo de resposta:</span> {selectedConnection.response_time || 'N/A'}</div>
                  <div><span className="font-medium">Criado em:</span> {new Date(selectedConnection.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Ações</h4>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                  Sincronizar Agora
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                  Editar
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                  Testar Conexão
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 