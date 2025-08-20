const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Obter token do localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    console.log('🔧 makeRequest:', { endpoint, url, hasToken: !!token });
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
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
      
      if (response.status === 401) {
        // Token expirado, tentar refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Re-tentar a requisição com novo token
          const newToken = localStorage.getItem('access_token');
          config.headers = {
            ...defaultHeaders,
            'Authorization': `Bearer ${newToken}`,
            ...options.headers,
          };
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return await retryResponse.json();
        } else {
          // Não redirecionar automaticamente, apenas limpar tokens
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
          throw new Error('Sessão expirada');
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(typeof errorMessage === 'string' ? errorMessage : `Erro ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Métodos para Reports
  async getReports() {
    return this.makeRequest('/reports');
  }

  async getWorkspaces() {
    return this.makeRequest('/workspaces');
  }

  async testWorkspaces() {
    return this.makeRequest('/test-workspaces');
  }

  async deleteWorkspace(id: string) {
    console.log('🔧 ApiService.deleteWorkspace chamado com ID:', id);
    return this.makeRequest(`/workspaces/${id}`, {
      method: 'DELETE',
    });
  }

  async createReport(data: any) {
    return this.makeRequest('/reports/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReport(id: string, data: any) {
    return this.makeRequest(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReport(id: string) {
    console.log('🔧 ApiService.deleteReport chamado com ID:', id);
    return this.makeRequest(`/reports/${id}`, {
      method: 'DELETE',
    });
  }

  async generateReport(id: string, format: string = 'pdf') {
    return this.makeRequest(`/reports/${id}/generate`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    });
  }

  // Métodos para Templates
  async getTemplates() {
    return this.makeRequest('/templates');
  }

  async createTemplate(data: any) {
    return this.makeRequest('/templates/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTemplate(id: string, data: any) {
    return this.makeRequest(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTemplate(id: string) {
    return this.makeRequest(`/templates/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para Data Preparation
  async uploadFile(file: File, options: any = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Adicionar opções ao FormData
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const token = localStorage.getItem('access_token');
    console.log('🔑 Token para upload:', token ? `${token.substring(0, 20)}...` : 'null');
    
    // Verificar se o token tem formato correto
    if (token) {
      const tokenParts = token.split('.');
      console.log('🔍 Token tem', tokenParts.length, 'partes');
      if (tokenParts.length !== 3) {
        console.error('❌ Token malformado:', tokenParts.length, 'partes');
        console.error('🔍 Partes do token:', tokenParts);
        // Limpar token malformado e redirecionar para login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw new Error('Token inválido: formato incorreto. Faça login novamente.');
      }
    } else {
      throw new Error('Token não encontrado. Faça login novamente.');
    }
    
    const response = await fetch(`${API_BASE_URL}/reports/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed! status: ${response.status}`);
    }

    return await response.json();
  }

  async processData(fileId: string, options: any) {
    return this.makeRequest(`/data-preparation/process/${fileId}`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  // Métodos para Analytics
  async getAnalytics() {
    return this.makeRequest('/analytics/');
  }

  async getDashboardWidgets(workspaceId: string, analysisTypes?: string) {
    const params = new URLSearchParams();
    if (analysisTypes) {
      params.append('analysis_types', analysisTypes);
    }
    return this.makeRequest(`/analytics/dashboard/${workspaceId}/widgets?${params.toString()}`);
  }

  async generateCustomWidgets(workspaceId: string, analysisTypes: string[]) {
    return this.makeRequest(`/analytics/dashboard/${workspaceId}/widgets/custom`, {
      method: 'POST',
      body: JSON.stringify({ analysis_types: analysisTypes }),
    });
  }

  // Novos métodos para análises específicas
  async generateExploratoryAnalysis(workspaceId: string, column: string, analysisType: string) {
    const params = new URLSearchParams({
      column: column,
      analysis_type: analysisType
    });
    return this.makeRequest(`/analytics/workspace/${workspaceId}/analysis/exploratory?${params.toString()}`, {
      method: 'POST'
    });
  }

  async generateTemporalAnalysis(workspaceId: string, dateColumn: string, valueColumn: string, granularity: string = 'month') {
    const params = new URLSearchParams({
      date_column: dateColumn,
      value_column: valueColumn,
      granularity: granularity
    });
    return this.makeRequest(`/analytics/workspace/${workspaceId}/analysis/temporal?${params.toString()}`, {
      method: 'POST'
    });
  }

  async generateCorrelationAnalysis(workspaceId: string, columns: string[]) {
    const params = new URLSearchParams();
    columns.forEach(col => params.append('columns', col));
    return this.makeRequest(`/analytics/workspace/${workspaceId}/analysis/correlation?${params.toString()}`, {
      method: 'POST'
    });
  }

  async generateGeographicAnalysis(workspaceId: string, locationColumn: string, valueColumn?: string) {
    const params = new URLSearchParams();
    params.append('location_column', locationColumn);
    if (valueColumn) {
      params.append('value_column', valueColumn);
    }
    return this.makeRequest(`/analytics/workspace/${workspaceId}/analysis/geographic?${params.toString()}`);
  }

  async autoAnalyzeWorkspace(workspaceId: string) {
    return this.makeRequest(`/analytics/test/auto-analyze-simple`, {
      method: 'POST',
    });
  }

  async getWorkspaceData(workspaceId: string, limit: number = 100) {
    return this.makeRequest(`/analytics/workspace/${workspaceId}/data?limit=${limit}`);
  }

  async createAnalysis(data: any) {
    return this.makeRequest('/analytics/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Métodos para AI Assistant
  async getAiSuggestions(prompt: string) {
    return this.makeRequest('/ai-assistant/suggest', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  async generateContent(data: any) {
    return this.makeRequest('/ai-assistant/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Métodos para Users
  async getProfile() {
    return this.makeRequest('/users/me');
  }

  async updateProfile(data: any) {
    return this.makeRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Métodos para Collaboration
  async getCollaborations() {
    return this.makeRequest('/collaboration/');
  }

  async shareReport(reportId: string, userEmail: string, permissions: string) {
    return this.makeRequest('/collaboration/share', {
      method: 'POST',
      body: JSON.stringify({
        report_id: reportId,
        user_email: userEmail,
        permissions,
      }),
    });
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }

  // Métodos para Análises
  async getExploratoryAnalysis(projectId: string, column?: string, analysisType: string = 'distribution'): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (column) params.append('column', column);
      params.append('analysis_type', analysisType);
      
      return await this.makeRequest(`/analytics/exploratory/${projectId}?${params.toString()}`);
    } catch (error) {
      console.error('Erro na análise exploratória:', error);
      throw error;
    }
  }

  async getDashboardData(projectId: string): Promise<any> {
    try {
      return await this.makeRequest(`/analytics/dashboard/${projectId}`);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      throw error;
    }
  }

  async generateAnalysisReport(projectId: string, reportType: string = 'comprehensive'): Promise<any> {
    try {
      return await this.makeRequest(`/analytics/generate-report/${projectId}`, {
        method: 'POST',
        body: JSON.stringify({ report_type: reportType }),
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  }

  async getAIInsights(projectId: string): Promise<any> {
    try {
      return await this.makeRequest(`/analytics/ai-insights/${projectId}`);
    } catch (error) {
      console.error('Erro ao buscar insights de IA:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 