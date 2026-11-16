"""Respostas de erro em um formato único (ver docs/adr/0007-formato-de-erro.md).

Todo erro da API sai assim:  {"erros": ["mensagem 1", "mensagem 2"]}
"""
from flask import jsonify
from werkzeug.exceptions import HTTPException

MENSAGENS_PADRAO = {
    400: "requisição inválida",
    404: "recurso não encontrado",
    405: "método não permitido para este recurso",
    500: "erro interno no servidor",
}


def registrar_erros(app):
    @app.errorhandler(HTTPException)
    def erro_http(e):
        # Se quem levantou o erro escreveu uma mensagem própria, ela é usada;
        # senão, usamos a mensagem padrão em português.
        personalizada = e.description != type(e).description
        mensagem = e.description if personalizada else MENSAGENS_PADRAO.get(e.code, e.name)
        return jsonify({"erros": [mensagem]}), e.code

    @app.errorhandler(500)
    def erro_interno(e):
        return jsonify({"erros": [MENSAGENS_PADRAO[500]]}), 500
