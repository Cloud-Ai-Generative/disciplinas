"""Rotas do recurso /doacoes.

    GET    /doacoes        lista as doações                   200
    GET    /doacoes/<id>   consulta uma doação                200 | 404
    POST   /doacoes        cadastra uma doação                201 | 400
    PUT    /doacoes/<id>   atualiza uma doação                200 | 400 | 404
    DELETE /doacoes/<id>   exclui uma doação                  204 | 404
"""
from flask import Blueprint, jsonify, request, url_for

from .extensions import db
from .models import Doacao
from .validacao import validar_doacao

bp = Blueprint("doacoes", __name__, url_prefix="/doacoes")

NAO_ENCONTRADA = "doação não encontrada"


@bp.get("")
def listar():
    doacoes = db.session.scalars(db.select(Doacao).order_by(Doacao.id)).all()
    return jsonify([d.to_dict() for d in doacoes])


@bp.get("/<int:doacao_id>")
def consultar(doacao_id):
    doacao = db.get_or_404(Doacao, doacao_id, description=NAO_ENCONTRADA)
    return jsonify(doacao.to_dict())


@bp.post("")
def cadastrar():
    dados, erros = validar_doacao(request.get_json(silent=True))
    if erros:
        return jsonify({"erros": erros}), 400

    doacao = Doacao(**dados)
    db.session.add(doacao)
    db.session.commit()

    local = url_for("doacoes.consultar", doacao_id=doacao.id)
    return jsonify(doacao.to_dict()), 201, {"Location": local}


@bp.put("/<int:doacao_id>")
def atualizar(doacao_id):
    doacao = db.get_or_404(Doacao, doacao_id, description=NAO_ENCONTRADA)

    dados, erros = validar_doacao(request.get_json(silent=True))
    if erros:
        return jsonify({"erros": erros}), 400

    for campo, valor in dados.items():
        setattr(doacao, campo, valor)
    db.session.commit()
    return jsonify(doacao.to_dict())


@bp.delete("/<int:doacao_id>")
def excluir(doacao_id):
    doacao = db.get_or_404(Doacao, doacao_id, description=NAO_ENCONTRADA)
    db.session.delete(doacao)
    db.session.commit()
    return "", 204
