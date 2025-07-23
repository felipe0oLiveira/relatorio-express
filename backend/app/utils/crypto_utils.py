import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

FERNET_KEY = os.environ["ENCRYPTION_KEY"].encode()
fernet = Fernet(FERNET_KEY)

def encrypt_data(data: str) -> str:
    """Criptografa uma string e retorna como string base64."""
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(token: str) -> str:
    """Descriptografa uma string criptografada."""
    return fernet.decrypt(token.encode()).decode()

def encrypt_file_bytes(file_bytes: bytes) -> bytes:
    """Criptografa bytes de arquivo."""
    return fernet.encrypt(file_bytes)

def decrypt_file_bytes(token: bytes) -> bytes:
    """Descriptografa bytes de arquivo criptografado."""
    return fernet.decrypt(token) 