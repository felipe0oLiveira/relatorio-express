"use client";

import React from 'react';

interface DataQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataQualityModal({ isOpen, onClose }: DataQualityModalProps) {
  const dataQualityReport = {
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
              Relatório de Qualidade de Dados
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Análise automática da qualidade dos dados importados
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
                  <span style={{ color: '#3b82f6', fontSize: '1.25rem' }}>💡</span>
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
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
} 