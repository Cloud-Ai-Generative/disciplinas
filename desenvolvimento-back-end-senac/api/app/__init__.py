"""API de doações da Associação Comunitária Vila Esperança.

Ponto de entrada da aplicação: a função create_app() monta e devolve a API
(padrão "app factory", ver docs/adr/0005-estrutura-em-camadas.md).
"""
from flask import Flask

from .config import Config
from .erros import registrar_erros
from .extensions import db


def create_app(config=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if config:
        app.config.update(config)

    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        raise RuntimeError(
            "DATABASE_URL não definida. Copie .env.example para .env e suba com docker compose."
        )

    # Respostas JSON na ordem dos campos e com acentos legíveis
    app.json.sort_keys = False
    app.json.ensure_ascii = False

    db.init_app(app)
    registrar_erros(app)

    @app.get("/saude")
    def saude():
        """Verifica se a API está no ar e se consegue falar com o banco."""
        db.session.execute(db.text("SELECT 1"))
        return {"status": "ok", "banco": "ok"}

    # Cria as tabelas que ainda não existem (ver docs/adr/0008-create-all-em-vez-de-migrations.md)
    with app.app_context():
        db.create_all()

    return app
