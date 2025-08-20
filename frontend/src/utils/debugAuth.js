/**
 * Utilitário para debugar problemas de autenticação
 */

export function debugAuth() {
  console.log('🔍 === DEBUG AUTENTICAÇÃO ===');
  
  // Verificar se estamos no browser
  if (typeof window === 'undefined') {
    console.log('❌ Não estamos no browser');
    return;
  }
  
  // Verificar tokens no localStorage
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  console.log('🔑 Tokens no localStorage:');
  console.log('  Access Token:', accessToken ? `${accessToken.substring(0, 50)}...` : 'null');
  console.log('  Refresh Token:', refreshToken ? `${refreshToken.substring(0, 50)}...` : 'null');
  
  // Verificar formato do token
  if (accessToken) {
    const tokenParts = accessToken.split('.');
    console.log('🔍 Formato do token:');
    console.log('  Partes:', tokenParts.length);
    console.log('  Válido:', tokenParts.length === 3);
    
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('📋 Payload do token:');
        console.log('  User ID:', payload.sub);
        console.log('  Email:', payload.email);
        console.log('  Expira em:', new Date(payload.exp * 1000).toLocaleString());
        console.log('  Já expirou:', Date.now() > payload.exp * 1000);
      } catch (e) {
        console.log('❌ Erro ao decodificar payload:', e);
      }
    }
  }
  
  // Verificar sessionStorage também
  const sessionAccessToken = sessionStorage.getItem('access_token');
  const sessionRefreshToken = sessionStorage.getItem('refresh_token');
  
  console.log('🔑 Tokens no sessionStorage:');
  console.log('  Access Token:', sessionAccessToken ? `${sessionAccessToken.substring(0, 50)}...` : 'null');
  console.log('  Refresh Token:', sessionRefreshToken ? `${sessionRefreshToken.substring(0, 50)}...` : 'null');
  
  console.log('🔍 === FIM DEBUG ===');
}

export function clearAllTokens() {
  console.log('🧹 Limpando todos os tokens...');
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    
    console.log('✅ Tokens limpos');
  }
}

export function testTokenValidity(token) {
  if (!token) {
    console.log('❌ Token não fornecido');
    return false;
  }
  
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    console.log('❌ Token malformado');
    return false;
  }
  
  try {
    const payload = JSON.parse(atob(tokenParts[1]));
    const isExpired = Date.now() > payload.exp * 1000;
    
    console.log('🔍 Validação do token:');
    console.log('  Válido:', !isExpired);
    console.log('  Expira em:', new Date(payload.exp * 1000).toLocaleString());
    console.log('  User ID:', payload.sub);
    
    return !isExpired;
  } catch (e) {
    console.log('❌ Erro ao validar token:', e);
    return false;
  }
}





