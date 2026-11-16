"""Modelo de dados: a tabela "doacoes" no PostgreSQL."""
from datetime import datetime, timezone

from .extensions import db


class Doacao(db.Model):
    __tablename__ = "doacoes"

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(20), nullable=False)          # alimento, roupa ou higiene
    descricao = db.Column(db.String(200), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    data_recebimento = db.Column(db.Date, nullable=False)
    doador = db.Column(db.String(100), nullable=True)        # opcional
    criado_em = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        """Converte a doação no JSON que a API devolve."""
        return {
            "id": self.id,
            "tipo": self.tipo,
            "descricao": self.descricao,
            "quantidade": self.quantidade,
            "data_recebimento": self.data_recebimento.isoformat(),
            "doador": self.doador,
        }

    def __repr__(self):
        return f"<Doacao {self.id} {self.tipo} x{self.quantidade}>"
