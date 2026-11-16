"""Comandos de terminal da API.

    flask seed   cadastra doações de exemplo, só se a tabela estiver vazia
"""
from datetime import date

import click

from .extensions import db
from .models import Doacao

DOACOES_EXEMPLO = [
    {"tipo": "alimento", "descricao": "Pacote de arroz 5 kg", "quantidade": 10,
     "data_recebimento": date(2026, 11, 3), "doador": "Mercearia do Zé"},
    {"tipo": "alimento", "descricao": "Pacote de feijão 1 kg", "quantidade": 15,
     "data_recebimento": date(2026, 11, 4), "doador": None},
    {"tipo": "roupa", "descricao": "Cobertor de casal", "quantidade": 4,
     "data_recebimento": date(2026, 11, 7), "doador": "Dona Lurdes"},
    {"tipo": "higiene", "descricao": "Sabonete em barra", "quantidade": 24,
     "data_recebimento": date(2026, 11, 10), "doador": "Grupo de jovens da paróquia"},
    {"tipo": "higiene", "descricao": "Pasta de dente", "quantidade": 12,
     "data_recebimento": date(2026, 11, 12), "doador": None},
]


def registrar_comandos(app):
    @app.cli.command("seed")
    def seed():
        """Cadastra doações de exemplo se a tabela estiver vazia."""
        if db.session.scalar(db.select(db.func.count()).select_from(Doacao)):
            click.echo("Já existem doações cadastradas. Nada a fazer.")
            return
        db.session.add_all(Doacao(**d) for d in DOACOES_EXEMPLO)
        db.session.commit()
        click.echo(f"{len(DOACOES_EXEMPLO)} doações de exemplo cadastradas.")
