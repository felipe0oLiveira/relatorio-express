"use client";

import React, { useEffect, useRef, useState } from 'react';

interface GoogleAuthButtonProps {
  onClick: (credential?: string) => void;
  isLoading?: boolean;
  text?: string;
}

const GoogleAuthButtonAlternative: React.FC<GoogleAuthButtonProps> = ({
  onClick,
  isLoading = false,
  text = "Continuar com Google"
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Carregar Google Identity API
    const loadGoogleIdentity = async () => {
      return new Promise<void>((resolve, reject) => {
        if (typeof window === 'undefined') {
          reject(new Error('Window not available'));
          return;
        }

        // Verificar se já está carregado
        if ((window as any).google) {
          setIsGoogleLoaded(true);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log("Google Identity API loaded successfully");
          setIsGoogleLoaded(true);
          resolve();
        };
        script.onerror = (error) => {
          console.error("Failed to load Google Identity API:", error);
          setError("Falha ao carregar Google Identity API");
          reject(new Error('Failed to load Google Identity API'));
        };
        document.head.appendChild(script);
      });
    };

    loadGoogleIdentity().catch((error) => {
      console.error("Error loading Google Identity:", error);
      setError("Erro ao carregar Google Identity");
    });
  }, []);

  useEffect(() => {
    // Renderizar o botão do Google quando a API carregar
    if (isGoogleLoaded && buttonRef.current && typeof window !== 'undefined' && (window as any).google) {
      try {
        console.log("Rendering Google button...");
        const google = (window as any).google;
        
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            try {
              console.log("Google callback received:", response);
              
              if (response && response.credential) {
                console.log("Credential received, length:", response.credential.length);
                console.log("Credential preview:", response.credential.substring(0, 50) + "...");
                
                // Verificar se o token tem o formato correto (3 partes)
                const parts = response.credential.split('.');
                if (parts.length !== 3) {
                  console.error("Invalid JWT format:", parts.length, "parts");
                  setError("Token inválido recebido do Google");
                  return;
                }
                
                await onClick(response.credential);
              } else {
                console.error("No credential received from Google");
                setError("Nenhuma credencial recebida do Google");
              }
            } catch (error: any) {
              console.error("Google auth callback error:", error);
              setError("Erro na autenticação Google");
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Renderizar o botão diretamente
        google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%',
        });

        console.log("Google button rendered successfully");
      } catch (error) {
        console.error("Error rendering Google button:", error);
        setError("Erro ao renderizar botão do Google");
      }
    }
  }, [isGoogleLoaded, onClick]);

  return (
    <div>
      <div ref={buttonRef} id="google-auth-button"></div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButtonAlternative; 