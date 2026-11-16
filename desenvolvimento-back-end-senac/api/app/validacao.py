"""Regras de validação de uma doação (ver docs/adr/0004-validacao-manual.md).

validar_doacao() recebe o JSON enviado pelo cliente e devolve uma tupla:
    (dados_limpos, [])      quando está tudo certo
    (None, [mensagens])     quando há erros; a rota responde 400 com as mensagens
"""
from datetime import date, datetime
from zoneinfo import ZoneInfo

TIPOS_VALIDOS = ("alimento", "roupa", "higiene")
FUSO = ZoneInfo("America/Sao_Paulo")  # "hoje" é o dia em Contagem, não em UTC


def hoje():
    return datetime.now(FUSO).date()


def validar_doacao(dados):
    if not isinstance(dados, dict):
        return None, ["o corpo da requisição deve ser um objeto JSON"]

    erros = []

    # tipo: obrigatório e de uma lista fechada
    tipo = dados.get("tipo")
    if not tipo:
        erros.append("tipo é obrigatório")
    elif tipo not in TIPOS_VALIDOS:
        erros.append(f"tipo deve ser um destes: {', '.join(TIPOS_VALIDOS)}")

    # descricao: obrigatória, até 200 caracteres
    descricao = dados.get("descricao")
    if not isinstance(descricao, str) or not descricao.strip():
        erros.append("descricao é obrigatória")
    elif len(descricao.strip()) > 200:
        erros.append("descricao deve ter no máximo 200 caracteres")

    # quantidade: obrigatória, número inteiro maior que zero
    quantidade = dados.get("quantidade")
    if quantidade is None:
        erros.append("quantidade é obrigatória")
    elif isinstance(quantidade, bool) or not isinstance(quantidade, int):
        erros.append("quantidade deve ser um número inteiro")
    elif quantidade <= 0:
        erros.append("quantidade deve ser maior que zero")

    # data_recebimento: obrigatória, formato AAAA-MM-DD, sem data futura
    data_texto = dados.get("data_recebimento")
    data_recebimento = None
    if not data_texto:
        erros.append("data_recebimento é obrigatória")
    else:
        try:
            data_recebimento = date.fromisoformat(str(data_texto))
        except ValueError:
            erros.append("data_recebimento deve estar no formato AAAA-MM-DD")
        else:
            if data_recebimento > hoje():
                erros.append("data_recebimento não pode ser uma data futura")

    # doador: opcional, até 100 caracteres
    doador = dados.get("doador")
    if doador is not None and not isinstance(doador, str):
        erros.append("doador deve ser um texto")
    elif doador and len(doador.strip()) > 100:
        erros.append("doador deve ter no máximo 100 caracteres")

    if erros:
        return None, erros

    return {
        "tipo": tipo,
        "descricao": descricao.strip(),
        "quantidade": quantidade,
        "data_recebimento": data_recebimento,
        "doador": doador.strip() if doador and doador.strip() else None,
    }, []
