#!/usr/bin/env python3

try:
    print("Testando import do app.main...")
    import app.main
    print("✅ app.main importado com sucesso")
except Exception as e:
    print(f"❌ Erro ao importar app.main: {e}")
    import traceback
    traceback.print_exc()

try:
    print("\nTestando import do app.auth.jwt_handler...")
    import app.auth.jwt_handler
    print("✅ app.auth.jwt_handler importado com sucesso")
except Exception as e:
    print(f"❌ Erro ao importar app.auth.jwt_handler: {e}")
    import traceback
    traceback.print_exc()

try:
    print("\nTestando import do app.dependencies.auth...")
    import app.dependencies.auth
    print("✅ app.dependencies.auth importado com sucesso")
except Exception as e:
    print(f"❌ Erro ao importar app.dependencies.auth: {e}")
    import traceback
    traceback.print_exc()

print("\n✅ Todos os testes concluídos!") 