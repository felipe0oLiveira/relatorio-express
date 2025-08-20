"use client";

import React, { useState } from 'react';
import DataQualityModal from './DataQualityModal';
import DataPreparationModal from './DataPreparationModal';
import { 
  Video, 
  HelpCircle, 
  X, 
  Info, 
  Database, 
  Clipboard, 
  Upload, 
  FileUp, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3,
  Calendar,
  DollarSign,
  Filter,
  RefreshCw,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';

interface ImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (tableData: any) => void;
}

export default function ImportWizard({ isOpen, onClose, onComplete }: ImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDataQuality, setShowDataQuality] = useState(false);
  const [showDataPreparation, setShowDataPreparation] = useState(false);
  const [formData, setFormData] = useState({
    workspaceName: 'Espaço de trabalho - 1',
    description: '',
    fileType: 'Excel',
    dataLocation: 'local',
    selectedFile: null as File | null,
    selectedSheet: 'Data Sales Adidas',
    importHiddenRows: false,
    importHiddenColumns: false,
    tableName: 'Data Sales Adidas',
    firstRowHeaders: 'Sim',
    dateFormat: 'dd MMM yyyy HH:mm:ss',
    errorHandling: 'Configure o valor vazio para a célula'
  });

  const [previewData] = useState([
    {
      Retailer: 'Foot Locker',
      'Retailer ID': '1185732',
      'Invoice Date': '01 Jan 2020 00:00:00',
      Region: 'Northeast',
      State: 'New York',
      City: 'New York',
      Product: "Men's Street Footwear",
      'Price per Unit': '$50.00',
      'Units Sold': '1,200',
      'Total Sales': '$600,000',
      'Operating Profit': '$300,000'
    },
    {
      Retailer: 'Foot Locker',
      'Retailer ID': '1185732',
      'Invoice Date': '02 Jan 2020 00:00:00',
      Region: 'Northeast',
      State: 'New York',
      City: 'New York',
      Product: "Men's Athletic Footwear",
      'Price per Unit': '$50.00',
      'Units Sold': '1,000',
      'Total Sales': '$500,000',
      'Operating Profit': '$150,000'
    },
    {
      Retailer: 'Foot Locker',
      'Retailer ID': '1185732',
      'Invoice Date': '06 Jan 2020 00:00:00',
      Region: 'Northeast',
      State: 'New York',
      City: 'New York',
      Product: "Women's Apparel",
      'Price per Unit': '$50.00',
      'Units Sold': '1,000',
      'Total Sales': '$500,000',
      'Operating Profit': '$125,000'
    }
  ]);

  const [dataQualityReport] = useState({
    overallScore: 87,
    issues: [
      { column: 'Retailer ID', issue: 'Valores duplicados', severity: 'Baixo', count: 3 },
      { column: 'Invoice Date', issue: 'Formato inconsistente', severity: 'Médio', count: 1 },
      { column: 'Price per Unit', issue: 'Valores nulos', severity: 'Alto', count: 0 },
      { column: 'Total Sales', issue: 'Inconsistência com cálculo', severity: 'Médio', count: 1 }
    ],
    recommendations: [
      'Padronizar formato de datas',
      'Verificar cálculos de vendas totais',
      'Considerar normalização de IDs de varejista'
    ]
  });

  const [dataPreparationOptions] = useState([
    { id: 'clean_dates', name: 'Limpar e padronizar datas', description: 'Converter todas as datas para formato ISO', applied: false },
    { id: 'normalize_currency', name: 'Normalizar valores monetários', description: 'Remover símbolos de moeda e padronizar decimais', applied: false },
    { id: 'remove_duplicates', name: 'Remover duplicatas', description: 'Identificar e remover registros duplicados', applied: false },
    { id: 'fill_missing', name: 'Preencher valores ausentes', description: 'Usar média ou moda para campos numéricos', applied: false },
    { id: 'validate_calculations', name: 'Validar cálculos', description: 'Verificar consistência entre preço, quantidade e total', applied: false }
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, selectedFile: file });
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar importação
      onComplete({
        id: Date.now(),
        name: formData.tableName,
        type: 'imported',
        createdAt: new Date().toLocaleDateString(),
        rows: Math.floor(Math.random() * 1000) + 100,
        data: previewData
      });
      onClose();
      setCurrentStep(1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataPreparationToggle = (optionId: string) => {
    // Simular aplicação de preparação de dados
    console.log(`Aplicando preparação: ${optionId}`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                Etapa {currentStep} de 3: Importar seus dados
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Importar dados de arquivos do Excel, CSV, HTML, XML, JSON, arquivos do Statistical e do MS Access
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Video size={20} />
              </button>
              <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <HelpCircle size={20} />
              </button>
              <button 
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Left Panel */}
            <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
              {currentStep === 1 && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      Nome do Espaço de Trabalho*
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1rem',
                        height: '1rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '50%',
                        cursor: 'help'
                      }}>
                        <Info size={12} />
                      </div>
                    </label>
                    <input
                      type="text"
                      value={formData.workspaceName}
                      onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      Tipo de arquivo
                    </label>
                    <select
                      value={formData.fileType}
                      onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="Excel">Excel</option>
                      <option value="CSV">CSV</option>
                      <option value="JSON">JSON</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      Localização dos dados
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[
                        { value: 'local', label: 'Unidade local', icon: <Database size={16} /> },
                        { value: 'pasted', label: 'Dados colados', icon: <Clipboard size={16} /> },
                        { value: 'ftp', label: 'FTP', icon: <Upload size={16} /> }
                      ].map((option) => (
                        <label key={option.value} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: formData.dataLocation === option.value ? '#f0f9ff' : 'white'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.dataLocation !== option.value) {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.dataLocation !== option.value) {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                        >
                          <input
                            type="radio"
                            name="dataLocation"
                            value={option.value}
                            checked={formData.dataLocation === option.value}
                            onChange={(e) => setFormData({ ...formData, dataLocation: e.target.value })}
                            style={{ margin: 0 }}
                          />
                          <div style={{ color: formData.dataLocation === option.value ? '#3b82f6' : '#64748b' }}>
                            {option.icon}
                          </div>
                          <span style={{ color: formData.dataLocation === option.value ? '#1e293b' : '#374151' }}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      Arquivo*
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv,.json"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                      >
                        <FileUp size={16} />
                        Escolher arquivo
                      </label>
                      <span style={{ color: '#64748b' }}>
                        {formData.selectedFile ? formData.selectedFile.name : 'Nenhum arquivo selecionado'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                      Formatos de arquivo suportados: arquivos .XLS e .XLSX
                    </p>
                    <a href="#" style={{ 
                      color: '#3b82f6', 
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.875rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      <FileText size={14} />
                      Experimente uma amostra
                    </a>
                  </div>

                  <div style={{ 
                    backgroundColor: '#f8fafc', 
                    padding: '1.5rem', 
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2rem',
                        height: '2rem',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        color: 'white'
                      }}>
                        <AlertTriangle size={16} />
                      </div>
                      <h4 style={{ color: '#374151', fontWeight: '600', margin: 0 }}>Nota:</h4>
                    </div>
                    <ul style={{ fontSize: '0.875rem', color: '#64748b', paddingLeft: '1.5rem', margin: 0 }}>
                      <li>Para outros formatos de arquivo, escolha acima a opção correspondente do "Tipo de Arquivo".</li>
                      <li>Para arquivo XLS de tamanho grande, nós recomendamos zipar e depois fazer o upload.</li>
                      <li>O arquivo XLS zipado pode conter apenas um arquivo.</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ color: '#374151', marginBottom: '1rem' }}>
                      Selecione o Folhas para ser importado: (Primeiras quatro linhas listadas de cada folha)
                    </p>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                      />
                      <span style={{ color: '#3b82f6', fontWeight: '500' }}>{formData.selectedSheet}</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#374151', fontWeight: '500' }}>
                      Visualização dos dados
                    </h4>
                    <div style={{ overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc' }}>
                            {Object.keys(previewData[0]).map((header) => (
                              <th key={header} style={{
                                padding: '0.75rem',
                                textAlign: 'left',
                                borderBottom: '1px solid #e5e7eb',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151'
                              }}>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((cell, cellIndex) => (
                                <td key={cellIndex} style={{
                                  padding: '0.75rem',
                                  borderBottom: '1px solid #e5e7eb',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      Importar colunas/linhas ocultas:
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.importHiddenRows}
                          onChange={(e) => setFormData({ ...formData, importHiddenRows: e.target.checked })}
                        />
                        <span>Importar linhas ocultas</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.importHiddenColumns}
                          onChange={(e) => setFormData({ ...formData, importHiddenColumns: e.target.checked })}
                        />
                        <span>Importar colunas ocultas</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      Nome da tabela
                    </label>
                    <input
                      type="text"
                      value={formData.tableName}
                      onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      A primeira linha contém os nomes de coluna?
                    </label>
                    <select
                      value={formData.firstRowHeaders}
                      onChange={(e) => setFormData({ ...formData, firstRowHeaders: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      Formato da(s) coluna(s) de data(s)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#64748b' }}>24 Nov 2014 22:47:59</span>
                      <select
                        value={formData.dateFormat}
                        onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="dd MMM yyyy HH:mm:ss">(dd MMM yyyy HH:mm:ss)</option>
                      </select>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      (dd MMM yyyy HH:mm:ss)
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <details style={{ border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}>
                      <summary style={{
                        padding: '1rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        &gt; Mais Configurações
                      </summary>
                      <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                          Configurações avançadas de importação...
                        </p>
                      </div>
                    </details>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ color: '#374151', fontWeight: '500' }}>
                        Visualização da data (5 primeiras linhas exibidas)
                      </h4>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => setShowDataQuality(true)}
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #d1d5db',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }}
                        >
                          <BarChart3 size={16} />
                          Exibir qualidade de dados
                        </button>
                        <button 
                          onClick={() => setShowDataPreparation(true)}
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #d1d5db',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }}
                        >
                          <Settings size={16} />
                          Preparar dados
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc' }}>
                            {Object.keys(previewData[0]).slice(0, 5).map((header) => (
                              <th key={header} style={{
                                padding: '0.75rem',
                                textAlign: 'left',
                                borderBottom: '1px solid #e5e7eb',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <input type="checkbox" checked={true} readOnly />
                                  <span>{header}</span>
                                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    {header === 'Retailer' && 'Texto sem formatação'}
                                    {header === 'Retailer ID' && 'Número positivo'}
                                    {header === 'Invoice Date' && 'Data'}
                                    {header === 'Region' && 'Texto sem formatação'}
                                    {header === 'State' && 'Texto sem formatação'}
                                  </span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.slice(0, 5).map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).slice(0, 5).map((cell, cellIndex) => (
                                <td key={cellIndex} style={{
                                  padding: '0.75rem',
                                  borderBottom: '1px solid #e5e7eb',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                      * Clique na célula do cabeçalho para editar os nomes de colunas
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                      Ao ocorrer erros de importação
                    </label>
                    <select
                      value={formData.errorHandling}
                      onChange={(e) => setFormData({ ...formData, errorHandling: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="Configure o valor vazio para a célula">Configure o valor vazio para a célula</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div style={{
              width: '300px',
              backgroundColor: '#f8fafc',
              padding: '2rem',
              borderLeft: '1px solid #e5e7eb'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#374151', fontWeight: '600' }}>
                Informações gerais:
              </h3>
              <div style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '1rem' }}>
                  O tamanho dos dados deve ser inferior a 100 MB e o número de linhas deve inferior a 1 Milhão
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Para fazer mais uploads, use nosso Databridge, dado que seus dados estejam nos formatos de arquivo de texto CSV ou TSV
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Entre em contato com support@zohoanalytics.com para receber assistência
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Cancelar
            </button>
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {currentStep === 3 ? 'Criar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Quality Modal */}
      {showDataQuality && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                  Relatório de Qualidade de Dados
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Análise automática da qualidade dos dados importados
                </p>
              </div>
              <button 
                onClick={() => setShowDataQuality(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
              {/* Overall Score */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#374151', fontWeight: '500' }}>
                  Pontuação Geral
                </h4>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.5rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '50%',
                    background: `conic-gradient(#10b981 0deg ${dataQualityReport.overallScore * 3.6}deg, #e5e7eb ${dataQualityReport.overallScore * 3.6}deg 360deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#374151'
                  }}>
                    {dataQualityReport.overallScore}%
                  </div>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                      Qualidade {dataQualityReport.overallScore >= 80 ? 'Excelente' : dataQualityReport.overallScore >= 60 ? 'Boa' : 'Necessita Melhorias'}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {dataQualityReport.issues.length} problemas identificados
                    </p>
                  </div>
                </div>
              </div>

              {/* Issues */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#374151', fontWeight: '500' }}>
                  Problemas Identificados
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {dataQualityReport.issues.map((issue, index) => (
                    <div key={index} style={{
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      backgroundColor: 'white'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '500', color: '#374151' }}>
                          {issue.column}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: issue.severity === 'Alto' ? '#fef2f2' : issue.severity === 'Médio' ? '#fffbeb' : '#f0fdf4',
                          color: issue.severity === 'Alto' ? '#dc2626' : issue.severity === 'Médio' ? '#d97706' : '#16a34a'
                        }}>
                          {issue.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                        {issue.issue}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {issue.count} ocorrência{issue.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#374151', fontWeight: '500' }}>
                  Recomendações
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {dataQualityReport.recommendations.map((rec, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.375rem'
                    }}>
                      <Zap size={16} />
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                        {rec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={() => setShowDataQuality(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Preparation Modal */}
      {showDataPreparation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                  Preparação de Dados
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Aplique transformações automáticas para melhorar a qualidade dos dados
                </p>
              </div>
              <button 
                onClick={() => setShowDataPreparation(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dataPreparationOptions.map((option) => (
                  <div key={option.id} style={{
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                  onClick={() => handleDataPreparationToggle(option.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                          {option.name}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {option.description}
                        </p>
                      </div>
                      <div style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '0.25rem',
                        backgroundColor: option.applied ? '#3b82f6' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {option.applied && <CheckCircle size={12} />}
                      </div>
                    </div>
                    
                    {/* Preview of changes */}
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      <strong>Preview:</strong> {option.id === 'clean_dates' && '01/01/2020 → 2020-01-01'}
                      {option.id === 'normalize_currency' && '$50.00 → 50.00'}
                      {option.id === 'remove_duplicates' && '3 registros → 1 registro único'}
                      {option.id === 'fill_missing' && 'Valores nulos → Média da coluna'}
                      {option.id === 'validate_calculations' && 'Verificar: Preço × Quantidade = Total'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem'
              }}>
                <h4 style={{ marginBottom: '1rem', color: '#166534', fontWeight: '500' }}>
                  Benefícios da Preparação
                </h4>
                <ul style={{ fontSize: '0.875rem', color: '#166534', paddingLeft: '1rem' }}>
                  <li>Melhora a precisão das análises</li>
                  <li>Reduz erros de processamento</li>
                  <li>Facilita a criação de relatórios</li>
                  <li>Garante consistência dos dados</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                onClick={() => {
                  // Aplicar todas as preparações
                  dataPreparationOptions.forEach(option => handleDataPreparationToggle(option.id));
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #10b981',
                  borderRadius: '0.375rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Aplicar Todas
              </button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowDataPreparation(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowDataPreparation(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Aplicar Selecionadas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Quality Modal */}
      <DataQualityModal 
        isOpen={showDataQuality}
        onClose={() => setShowDataQuality(false)}
      />

      {/* Data Preparation Modal */}
      <DataPreparationModal 
        isOpen={showDataPreparation}
        onClose={() => setShowDataPreparation(false)}
      />
    </>
  );
} 