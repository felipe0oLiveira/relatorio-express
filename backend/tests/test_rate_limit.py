import requests

TOKEN = "COLE_SEU_TOKEN_AQUI"

url = "http://127.0.0.1:8000/reports"
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

for i in range(35):
    data = {"title": f"Teste {i}", "description": "desc"}
    response = requests.post(url, json=data, headers=headers)
    print(f"{i+1}: Status {response.status_code} - {response.text}")