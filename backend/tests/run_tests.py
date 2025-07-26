#!/usr/bin/env python3
"""
Script para executar testes dos sistemas de Analytics e Backup
Execute: python run_tests.py
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Executa um comando e mostra o resultado"""
    print(f"\n[COMANDO] {description}")
    print(f"Comando: {command}")
    print("-" * 50)
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("[OK] Sucesso!")
            if result.stdout:
                print("Saida:")
                print(result.stdout)
        else:
            print("[ERRO] Erro!")
            if result.stderr:
                print("Erro:")
                print(result.stderr)
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"[ERRO] Erro ao executar comando: {e}")
        return False

def check_server_status():
    """Verifica se o servidor está rodando"""
    print("Verificando status do servidor...")
    
    try:
        import requests
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("[OK] Servidor esta rodando!")
            return True
        else:
            print(f"[ATENCAO] Servidor respondeu com status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("[ERRO] Servidor nao esta rodando")
        print("[DICA] Execute: uvicorn app.main:app --reload")
        return False
    except ImportError:
        print("[ATENCAO] requests nao esta instalado, pulando verificacao")
        return True

def main():
    """Função principal"""
    print("TESTES DOS SISTEMAS ANALYTICS E BACKUP")
    print("=" * 60)
    
    # Verificar se estamos no diretório correto
    if not os.path.exists("app"):
        print("[ERRO] Execute este script no diretorio backend/")
        sys.exit(1)
    
    # Verificar status do servidor
    server_running = check_server_status()
    
    # Instalar dependências se necessário
    print("\nVerificando dependencias...")
    run_command("pip install -r app/requirements.txt", "Instalando dependencias")
    
    # Executar testes
    print("\nExecutando testes...")
    
    if os.path.exists("tests/test_analytics_backup.py"):
        success = run_command(
            "python tests/test_analytics_backup.py", 
            "Executando testes de Analytics e Backup"
        )
    else:
        print("[ERRO] Arquivo de testes nao encontrado")
        success = False
    
    # Resumo
    print("\n" + "=" * 60)
    print("RESUMO")
    print("=" * 60)
    
    if not server_running:
        print("[ATENCAO] Servidor nao esta rodando")
        print("[DICA] Para iniciar o servidor:")
        print("   cd backend")
        print("   uvicorn app.main:app --reload")
    
    if success:
        print("[OK] Testes executados com sucesso!")
    else:
        print("[ERRO] Alguns testes falharam")
        print("\n[DICAS] Para resolver problemas:")
        print("1. Certifique-se de que o servidor esta rodando")
        print("2. Execute o script SQL no Supabase: setup_backup_tables.sql")
        print("3. Verifique se as variaveis de ambiente estao configuradas")
        print("4. Consulte os logs do servidor para erros")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 