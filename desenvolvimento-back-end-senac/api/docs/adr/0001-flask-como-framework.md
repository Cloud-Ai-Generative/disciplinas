# ADR 0001 · Flask como framework da API

- **Status:** aceita
- **Data:** 16/11/2026
- **Responsável:** Bia Ferreira (tech lead)

## Contexto

A Associação Vila Esperança precisa de uma API para registrar doações. O desafio pede Python com FastAPI, Flask ou Django REST Framework. A turma está aprendendo back-end, e o objetivo da Unidade Curricular é entender como uma API funciona por dentro, não só usá-la.

## Decisão

Usar **Flask**, com a extensão **Flask-SQLAlchemy** para acessar o banco.

## Alternativas consideradas

- **FastAPI:** valida dados e gera documentação (Swagger) automaticamente. Ótimo em produção, mas esconde justamente o que queremos ensinar nesta etapa: como a validação e as respostas de erro são construídas.
- **Django REST Framework:** completo e poderoso, mas traz muitas convenções e arquivos de uma vez. Para uma API de um recurso só, o custo de aprendizado é maior que o benefício.

## Consequências

- ✅ Código pequeno e explícito: cada rota é uma função que o aluno lê de cima a baixo.
- ✅ Flask é maduro, com documentação extensa e grande comunidade.
- ⚠️ Não temos validação nem documentação automáticas: escrevemos a validação à mão (ADR 0004) e mantemos o `requests.http` como documentação viva.
