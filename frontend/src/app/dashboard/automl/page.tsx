"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AutoMLPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('experiments');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewExperimentModal, setShowNewExperimentModal] = useState(false);
  const [showModelDetails, setShowModelDetails] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [experimentName, setExperimentName] = useState('');
  const [experimentDescription, setExperimentDescription] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [targetVariable, setTargetVariable] = useState('');
  const [modelType, setModelType] = useState('classification');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

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

  const handleCreateExperiment = () => {
    setShowNewExperimentModal(true);
  };

  const handleStartTraining = async () => {
    if (!experimentName.trim() || !selectedDataset || !targetVariable) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          alert('Modelo treinado com sucesso!');
          setShowNewExperimentModal(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleViewModel = (model: any) => {
    setSelectedModel(model);
    setShowModelDetails(true);
  };

  // Empty data arrays - ready for real data
  const experiments: any[] = [];
  const models: any[] = [];
  const datasets = [
    { id: '1', name: 'Vendas 2024', description: 'Dados de vendas do ano de 2024' },
    { id: '2', name: 'Clientes', description: 'Base de dados de clientes' },
    { id: '3', name: 'Produtos', description: 'Catálogo de produtos' }
  ];

  const filteredExperiments = experiments.filter(exp =>
    exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            onClick={handleCreateExperiment}
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
            { id: 'automl', label: 'AutoML', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', active: true },
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
                <h1 className="text-2xl font-bold text-gray-900">AutoML</h1>
                <p className="text-gray-600 mt-1">Crie modelos de machine learning automaticamente</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {[
                { id: 'experiments', label: 'Experimentos' },
                { id: 'models', label: 'Modelos' }
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
                    placeholder={`Buscar ${activeTab === 'experiments' ? 'experimentos' : 'modelos'}...`}
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
            {activeTab === 'experiments' && (
              <div className="grid gap-4">
                {filteredExperiments.map((experiment) => (
                  <div key={experiment.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{experiment.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{experiment.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Status: {experiment.status}</span>
                          <span>Dataset: {experiment.dataset}</span>
                          <span>Criado: {new Date(experiment.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200">
                          Ver Detalhes
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

            {activeTab === 'models' && (
              <div className="grid gap-4">
                {filteredModels.map((model) => (
                  <div key={model.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{model.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{model.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Acurácia: {model.accuracy}%</span>
                          <span>Tipo: {model.type}</span>
                          <span>Criado: {new Date(model.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewModel(model)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                        >
                          Ver Modelo
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors duration-200">
                          Fazer Predição
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {((activeTab === 'experiments' && filteredExperiments.length === 0) || 
              (activeTab === 'models' && filteredModels.length === 0)) && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                  <div className="mb-6">
                    <svg className="w-24 h-24 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      {/* Neural Network Icon */}
                      <defs>
                        <linearGradient id="nnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#1D4ED8', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      <circle cx="12" cy="6" r="2" fill="url(#nnGradient)" opacity="0.8"/>
                      <circle cx="6" cy="12" r="2" fill="url(#nnGradient)" opacity="0.6"/>
                      <circle cx="18" cy="12" r="2" fill="url(#nnGradient)" opacity="0.6"/>
                      <circle cx="12" cy="18" r="2" fill="url(#nnGradient)" opacity="0.8"/>
                      <line x1="12" y1="8" x2="6" y2="10" stroke="url(#nnGradient)" strokeWidth="1" opacity="0.4"/>
                      <line x1="12" y1="8" x2="18" y2="10" stroke="url(#nnGradient)" strokeWidth="1" opacity="0.4"/>
                      <line x1="6" y1="14" x2="12" y2="16" stroke="url(#nnGradient)" strokeWidth="1" opacity="0.4"/>
                      <line x1="18" y1="14" x2="12" y2="16" stroke="url(#nnGradient)" strokeWidth="1" opacity="0.4"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {searchTerm ? 'Nenhum resultado encontrado' : `Nenhum ${activeTab === 'experiments' ? 'experimento' : 'modelo'} criado`}
                  </h3>
                  <p className="text-gray-600 mb-8 text-base">
                    {searchTerm 
                      ? 'Tente ajustar sua busca'
                      : `Comece criando seu primeiro ${activeTab === 'experiments' ? 'experimento' : 'modelo'} de machine learning`
                    }
                  </p>
                  <button
                    onClick={handleCreateExperiment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-base"
                  >
                    Criar Experimento
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New Experiment Modal */}
      {showNewExperimentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Novo Experimento</h3>
              <button
                onClick={() => setShowNewExperimentModal(false)}
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
                  Nome do Experimento*
                </label>
                <input
                  type="text"
                  value={experimentName}
                  onChange={(e) => setExperimentName(e.target.value)}
                  placeholder="Digite o nome do experimento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={experimentDescription}
                  onChange={(e) => setExperimentDescription(e.target.value)}
                  rows={3}
                  placeholder="Descreva o objetivo do experimento..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dataset*
                </label>
                <select
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um dataset</option>
                  {datasets.map(dataset => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name} - {dataset.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variável Alvo*
                </label>
                <input
                  type="text"
                  value={targetVariable}
                  onChange={(e) => setTargetVariable(e.target.value)}
                  placeholder="Nome da coluna que será predita"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Modelo*
                </label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="classification">Classificação</option>
                  <option value="regression">Regressão</option>
                  <option value="clustering">Clustering</option>
                </select>
              </div>

              {isTraining && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Treinando modelo...</span>
                    <span className="text-sm text-blue-700">{trainingProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewExperimentModal(false)}
                disabled={isTraining}
                className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg transition-colors duration-200 ${
                  isTraining 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleStartTraining}
                disabled={isTraining}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isTraining
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isTraining ? 'Treinando...' : 'Iniciar Treinamento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Details Modal */}
      {showModelDetails && selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Detalhes do Modelo</h3>
              <button
                onClick={() => setShowModelDetails(false)}
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
                  <div><span className="font-medium">Nome:</span> {selectedModel.name}</div>
                  <div><span className="font-medium">Tipo:</span> {selectedModel.type}</div>
                  <div><span className="font-medium">Acurácia:</span> {selectedModel.accuracy}%</div>
                  <div><span className="font-medium">Dataset:</span> {selectedModel.dataset}</div>
                  <div><span className="font-medium">Criado em:</span> {new Date(selectedModel.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Métricas</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Precisão:</span> {selectedModel.precision || 'N/A'}</div>
                  <div><span className="font-medium">Recall:</span> {selectedModel.recall || 'N/A'}</div>
                  <div><span className="font-medium">F1-Score:</span> {selectedModel.f1Score || 'N/A'}</div>
                  <div><span className="font-medium">Tempo de treinamento:</span> {selectedModel.trainingTime || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Ações</h4>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                  Fazer Predição
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                  Exportar Modelo
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 