// Script para obter token do Supabase
// Execute: node test_token.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Configure SUPABASE_URL e SUPABASE_ANON_KEY no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
    console.log('🔐 Testando autenticação com Supabase...\n');
    
    try {
        // 1. Tentar fazer login com credenciais de teste
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'test@autoreport.com',
            password: 'password123'
        });
        
        if (error) {
            console.log('❌ Erro no login:', error.message);
            console.log('\n📝 Para criar um usuário de teste:');
            console.log('1. Acesse o dashboard do Supabase');
            console.log('2. Vá para Authentication → Users');
            console.log('3. Clique em "Add User"');
            console.log('4. Crie um usuário com email e senha');
            console.log('5. Execute este script novamente');
            return;
        }
        
        if (data.session) {
            const token = data.session.access_token;
            console.log('✅ Login realizado com sucesso!');
            console.log('🔑 Token obtido:', token);
            console.log('👤 User ID:', data.user.id);
            
            // Testar o token no nosso backend
            console.log('\n🧪 Testando token no backend...');
            const response = await fetch('http://localhost:8000/auth/test', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Backend respondeu:', result);
            } else {
                const error = await response.text();
                console.log('❌ Erro no backend:', error);
            }
        }
        
    } catch (err) {
        console.log('❌ Erro:', err.message);
    }
}

// Executar o teste
testAuth(); 