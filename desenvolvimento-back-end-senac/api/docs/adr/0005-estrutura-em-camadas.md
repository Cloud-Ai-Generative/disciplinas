# ADR 0005 · App factory, blueprint, modelo e validação separados

- **Status:** aceita
- **Data:** 16/11/2026
- **Responsável:** Bia Ferreira (tech lead)

## Contexto

Em Flask é possível escrever a API inteira num único `app.py`. Funciona no começo, mas mistura configuração, rotas, regras e banco no mesmo arquivo, e dificulta testar e crescer.

## Decisão

Separar responsabilidades:

```
app/
├── __init__.py     create_app(): monta a aplicação (app factory)
├── config.py       configuração lida do ambiente
├── extensions.py   o objeto db, compartilhado
├── models.py       o modelo Doacao (tabela doacoes)
├── validacao.py    as regras de validação
├── routes.py       as rotas de /doacoes (blueprint)
├── erros.py        o formato único de erro
└── cli.py          o comando "flask seed"
```

## Alternativas consideradas

- **Um único `app.py`:** mais simples para um "olá, mundo", mas cresce mal.
- **Camadas completas (serviços, repositórios):** adequado para sistemas maiores; aqui seria excesso para um recurso só.

## Consequências

- ✅ Cada arquivo tem um motivo para mudar: regra nova mexe em `validacao.py`, rota nova em `routes.py`.
- ✅ A app factory permite criar a API com outra configuração nos testes (SQLite em memória).
- ✅ Novos recursos (por exemplo, `/familias`) entram como novos blueprints.
- ⚠️ Mais arquivos para quem está começando: o diagrama da estrutura no ODA ajuda a se localizar.
