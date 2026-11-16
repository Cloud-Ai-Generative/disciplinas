"""Configuração lida de variáveis de ambiente (ver docs/adr/0006-configuracao-por-env.md).

Nenhuma senha ou endereço de banco fica escrito no código: tudo vem do
arquivo .env, que o Docker Compose entrega para o contêiner.
"""
import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
