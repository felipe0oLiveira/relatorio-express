"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleAuthButtonAlternative from '../../components/GoogleAuthButtonAlternative';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Erro no login');
    }
  };

  const handleGoogleAuth = async (credential?: string) => {
    if (!credential) {
      setError('Nenhuma credencial recebida do Google');
      return;
    }

    setError('');

    try {
      console.log('Sending Google credential to backend...');
      await loginWithGoogle(credential);
    } catch (error: any) {
      console.error('Google auth error:', error);
      setError(error.message || 'Erro na autenticação Google');
    }
  };



  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1e1b4b, #581c87, #be185d)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #f3f4f6',
        padding: '2rem',
        width: '100%',
        maxWidth: '28rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(to right, #2563eb, #4f46e5)',
            borderRadius: '50%',
            marginBottom: '1rem'
          }}>
            <svg style={{ width: '2rem', height: '2rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Bem-vindo de volta
          </h1>
          <p style={{ color: '#6b7280' }}>
            Entre na sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s'
                }}
                placeholder="seu@email.com"
              />
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <svg style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s'
                }}
                placeholder="••••••••"
              />
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <svg style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              fontSize: '0.875rem',
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '1rem',
              borderRadius: '0.75rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              fontWeight: '600',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.5rem'
                }}></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
          

        </form>

        {/* Divider */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <span style={{ padding: '0 1rem', backgroundColor: 'white', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                ou continue com
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <GoogleAuthButtonAlternative
              onClick={handleGoogleAuth}
              isLoading={isLoading}
              text="Continuar com Google"
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Não tem uma conta?{' '}
            <a 
              href="/register"
              style={{ 
                fontWeight: '600', 
                color: '#2563eb', 
                textDecoration: 'none'
              }}
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 