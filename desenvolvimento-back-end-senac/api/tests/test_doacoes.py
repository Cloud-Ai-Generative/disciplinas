"""Testes automatizados da API.

Rode dentro do contêiner:   docker compose exec api pytest
Por padrão usam um SQLite em memória; para testar no PostgreSQL,
defina TEST_DATABASE_URL.
"""
import os

import pytest

from app import create_app
from app.extensions import db


@pytest.fixture()
def client():
    url = os.environ.get("TEST_DATABASE_URL", "sqlite:///:memory:")
    app = create_app({"TESTING": True, "SQLALCHEMY_DATABASE_URI": url})
    with app.app_context():
        db.drop_all()
        db.create_all()
    yield app.test_client()
    with app.app_context():
        db.session.remove()
        db.drop_all()


def test_saude(client):
    r = client.get("/saude")
    assert r.status_code == 200
    assert r.get_json() == {"status": "ok", "banco": "ok"}


def test_rota_inexistente_devolve_404_no_formato_padrao(client):
    r = client.get("/nao-existe")
    assert r.status_code == 404
    assert r.get_json() == {"erros": ["recurso não encontrado"]}


def test_lista_vazia(client):
    r = client.get("/doacoes")
    assert r.status_code == 200
    assert r.get_json() == []


def test_consultar_inexistente_devolve_404(client):
    r = client.get("/doacoes/999")
    assert r.status_code == 404
    assert r.get_json() == {"erros": ["doação não encontrada"]}
