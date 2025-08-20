const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  name?: string;
  company?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
  company?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Auth request failed:', error);
      throw error;
    }
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        company: data.company,
      }),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🔐 Iniciando login para:', data.email);
    
    const response = await this.makeRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
    
    console.log('📋 Resposta do login:', response);
    console.log('🔑 Access token presente:', 'access_token' in response);
    console.log('👤 User presente:', 'user' in response);
    
    return response;
  }

  async googleAuth(accessToken: string): Promise<AuthResponse> {
    return this.makeRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });
  }

  // Armazenar tokens no localStorage
  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      console.log('🔑 Salvando tokens no localStorage:');
      console.log('📋 Access token:', accessToken ? `${accessToken.substring(0, 50)}...` : 'null');
      console.log('📋 Refresh token:', refreshToken ? `${refreshToken.substring(0, 50)}...` : 'null');
      
      // Verificar formato do token antes de salvar
      if (accessToken) {
        const tokenParts = accessToken.split('.');
        console.log('🔍 Token tem', tokenParts.length, 'partes');
        if (tokenParts.length !== 3) {
          console.error('❌ Token malformado sendo salvo:', tokenParts.length, 'partes');
          console.error('🔍 Partes do token:', tokenParts);
        } else {
          console.log('✅ Token tem formato correto');
        }
      }
      
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  // Obter tokens do localStorage
  getTokens() {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      return {
        accessToken,
        refreshToken,
      };
    }
    return { accessToken: null, refreshToken: null };
  }

  // Limpar tokens (logout)
  clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const { accessToken } = this.getTokens();
    
    // Verificar se o token tem formato correto
    if (accessToken) {
      const tokenParts = accessToken.split('.');
      if (tokenParts.length !== 3) {
        console.error('❌ Token malformado detectado, limpando...');
        this.clearTokens();
        return false;
      }
    }
    
    return !!accessToken;
  }
  
  // Limpar tokens malformados
  clearInvalidTokens() {
    const { accessToken } = this.getTokens();
    if (accessToken) {
      const tokenParts = accessToken.split('.');
      console.log('🔍 Verificando token:', tokenParts.length, 'partes');
      if (tokenParts.length !== 3) {
        console.log('🧹 Limpando tokens malformados...');
        this.clearTokens();
        return true;
      }
    }
    return false;
  }
  
  // Forçar limpeza completa
  forceClearAll() {
    console.log('🧹 Forçando limpeza completa de tokens...');
    this.clearTokens();
    // Limpar também do sessionStorage se existir
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
    }
  }
}

export const authService = new AuthService(); 