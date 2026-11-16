"""Testes automatizados da API.

Rode dentro do contêiner:   docker compose exec api python -m pytest
Por padrão usam um SQLite em memória; para testar no PostgreSQL,
defina TEST_DATABASE_URL.
"""
import os
from datetime import timedelta

import pytest

from app import create_app
from app.extensions import db
from app.validacao import hoje


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


VALIDA = {
    "tipo": "alimento",
    "descricao": "Pacote de arroz 5 kg",
    "quantidade": 10,
    "data_recebimento": "2026-11-03",
    "doador": "Mercearia do Zé",
}


def test_cadastrar_doacao_valida(client):
    r = client.post("/doacoes", json=VALIDA)
    assert r.status_code == 201
    corpo = r.get_json()
    assert corpo["id"] > 0
    assert corpo["descricao"] == "Pacote de arroz 5 kg"
    assert r.headers["Location"] == f"/doacoes/{corpo['id']}"

    # e ela aparece na consulta e na listagem
    assert client.get(r.headers["Location"]).get_json() == corpo
    assert client.get("/doacoes").get_json() == [corpo]


def test_doador_e_opcional(client):
    sem_doador = {k: v for k, v in VALIDA.items() if k != "doador"}
    r = client.post("/doacoes", json=sem_doador)
    assert r.status_code == 201
    assert r.get_json()["doador"] is None


@pytest.mark.parametrize(
    "alteracao, mensagem",
    [
        ({"tipo": None}, "tipo é obrigatório"),
        ({"tipo": "brinquedo"}, "tipo deve ser um destes: alimento, roupa, higiene"),
        ({"descricao": "   "}, "descricao é obrigatória"),
        ({"descricao": "x" * 201}, "descricao deve ter no máximo 200 caracteres"),
        ({"quantidade": None}, "quantidade é obrigatória"),
        ({"quantidade": -5}, "quantidade deve ser maior que zero"),
        ({"quantidade": 0}, "quantidade deve ser maior que zero"),
        ({"quantidade": "10"}, "quantidade deve ser um número inteiro"),
        ({"quantidade": 2.5}, "quantidade deve ser um número inteiro"),
        ({"quantidade": True}, "quantidade deve ser um número inteiro"),
        ({"data_recebimento": None}, "data_recebimento é obrigatória"),
        ({"data_recebimento": "03/11/2026"}, "data_recebimento deve estar no formato AAAA-MM-DD"),
        ({"doador": 123}, "doador deve ser um texto"),
        ({"doador": "y" * 101}, "doador deve ter no máximo 100 caracteres"),
    ],
)
def test_cadastro_invalido_devolve_400(client, alteracao, mensagem):
    r = client.post("/doacoes", json={**VALIDA, **alteracao})
    assert r.status_code == 400
    assert r.get_json() == {"erros": [mensagem]}
    assert client.get("/doacoes").get_json() == []  # nada foi gravado


def test_data_futura_devolve_400(client):
    amanha = (hoje() + timedelta(days=1)).isoformat()
    r = client.post("/doacoes", json={**VALIDA, "data_recebimento": amanha})
    assert r.status_code == 400
    assert r.get_json() == {"erros": ["data_recebimento não pode ser uma data futura"]}


def test_varios_erros_de_uma_vez(client):
    r = client.post("/doacoes", json={"descricao": "Cesta básica", "quantidade": -1})
    assert r.status_code == 400
    assert r.get_json()["erros"] == [
        "tipo é obrigatório",
        "quantidade deve ser maior que zero",
        "data_recebimento é obrigatória",
    ]


def test_corpo_que_nao_e_json_devolve_400(client):
    r = client.post("/doacoes", data="tipo=alimento", content_type="text/plain")
    assert r.status_code == 400
    assert r.get_json() == {"erros": ["o corpo da requisição deve ser um objeto JSON"]}


def test_atualizar_doacao(client):
    id_ = client.post("/doacoes", json=VALIDA).get_json()["id"]
    r = client.put(f"/doacoes/{id_}", json={**VALIDA, "quantidade": 8})
    assert r.status_code == 200
    assert r.get_json()["quantidade"] == 8
    assert client.get(f"/doacoes/{id_}").get_json()["quantidade"] == 8


def test_atualizar_com_dados_invalidos_devolve_400(client):
    id_ = client.post("/doacoes", json=VALIDA).get_json()["id"]
    r = client.put(f"/doacoes/{id_}", json={**VALIDA, "quantidade": -1})
    assert r.status_code == 400
    assert client.get(f"/doacoes/{id_}").get_json()["quantidade"] == 10  # não mudou


def test_atualizar_inexistente_devolve_404(client):
    r = client.put("/doacoes/999", json=VALIDA)
    assert r.status_code == 404


def test_excluir_doacao(client):
    id_ = client.post("/doacoes", json=VALIDA).get_json()["id"]
    r = client.delete(f"/doacoes/{id_}")
    assert r.status_code == 204
    assert r.data == b""
    assert client.get(f"/doacoes/{id_}").status_code == 404


def test_excluir_inexistente_devolve_404(client):
    assert client.delete("/doacoes/999").status_code == 404
