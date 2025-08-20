"use client";

import React, { useState } from 'react';

interface DataPreparationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataPreparationModal({ isOpen, onClose }: DataPreparationModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const dataPreparationOptions = [
    { id: 'clean_dates', name: 'Limpar e padronizar datas', description: 'Converter todas as datas para formato ISO', applied: false },
    { id: 'normalize_currency', name: 'Normalizar valores monetários', description: 'Remover símbolos de moeda e padronizar decimais', applied: false },
    { id: 'remove_duplicates', name: 'Remover duplicatas', description: 'Identificar e remover registros duplicados', applied: false },
    { id: 'fill_missing', name: 'Preencher valores ausentes', description: 'Usar média ou moda para campos numéricos', applied: false },
    { id: 'validate_calculations', name: 'Validar cálculos', description: 'Verificar consistência entre preço, quantidade e total', applied: false }
  ];

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleApplyAll = () => {
    setSelectedOptions(dataPreparationOptions.map(option => option.id));
  };

  const handleApplySelected = () => {
    console.log('Aplicando preparações:', selectedOptions);
    onClose();
  };

  if (!isOpen) return null;

  return (
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
            onClick={onClose}
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
              onClick={() => handleOptionToggle(option.id)}
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
                    backgroundColor: selectedOptions.includes(option.id) ? '#3b82f6' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {selectedOptions.includes(option.id) && '✓'}
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
            onClick={handleApplyAll}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #10b981',
              borderRadius: '0.375rem',
              backgroundColor: '#10b981',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            Aplicar Todas
          </button>
          <div style={{ display: 'flex', gap: '1rem' }}>
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
            <button
              onClick={handleApplySelected}
              disabled={selectedOptions.length === 0}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                backgroundColor: selectedOptions.length > 0 ? '#3b82f6' : '#d1d5db',
                color: 'white',
                cursor: selectedOptions.length > 0 ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedOptions.length > 0) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedOptions.length > 0) {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Aplicar Selecionadas ({selectedOptions.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 