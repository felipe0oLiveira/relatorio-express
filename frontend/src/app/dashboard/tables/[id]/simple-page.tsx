"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function SimpleTableDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tableId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true);
        
        // Simular dados de teste
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
      <div className="fixed lg:relative z-50 h-full bg-gray-900 text-white w-64 flex-shrink-0 shadow-lg">
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              A
            </div>
            <span className="text-base font-semibold text-white truncate">
              AutoReport
            </span>
          </div>
        </div>
        
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-700 bg-gray-900">
          <button 
            onClick={() => router.push('/dashboard/explore')}
            className="w-full h-9 lg:h-10 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm"
          >
            ← Voltar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tableData.name}</h1>
              <p className="text-gray-600">{tableData.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informações Gerais</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Linhas:</span>
                    <span className="font-medium">{tableData.rows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Colunas:</span>
                    <span className="font-medium">{tableData.columns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tamanho:</span>
                    <span className="font-medium">{tableData.size}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados de Amostra</h3>
                <div className="space-y-2">
                  {tableData.sampleData.slice(0, 3).map((row, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {Object.entries(row).map(([key, value]) => (
                        <span key={key} className="mr-2">
                          <strong>{key}:</strong> {String(value)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Colunas</h3>
                <div className="space-y-2">
                  {tableData.columns.slice(0, 5).map((col, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{col.name}</span>
                      <span className="text-gray-500 ml-2">({col.type})</span>
                    </div>
                  ))}
                  {tableData.columns.length > 5 && (
                    <div className="text-sm text-gray-500">
                      +{tableData.columns.length - 5} mais colunas
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Análises Disponíveis</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-blue-600 text-2xl mb-2">📊</div>
                    <h4 className="font-medium text-gray-900">Análise Exploratória</h4>
                    <p className="text-sm text-gray-600">Explore padrões e tendências</p>
                  </button>
                  
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-green-600 text-2xl mb-2">📈</div>
                    <h4 className="font-medium text-gray-900">Relatórios</h4>
                    <p className="text-sm text-gray-600">Gere relatórios automáticos</p>
                  </button>
                  
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-purple-600 text-2xl mb-2">🤖</div>
                    <h4 className="font-medium text-gray-900">IA Assistant</h4>
                    <p className="text-sm text-gray-600">Análise com inteligência artificial</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 