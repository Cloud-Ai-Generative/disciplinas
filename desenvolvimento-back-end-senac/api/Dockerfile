# Imagem da API de doações
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app

WORKDIR /app

# Primeiro só as dependências: assim o Docker reaproveita esta camada
# enquanto o requirements.txt não mudar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Cadastra os exemplos (se o banco estiver vazio) e sobe a API
CMD ["sh", "-c", "flask seed && flask run --host 0.0.0.0 --port 8000"]
