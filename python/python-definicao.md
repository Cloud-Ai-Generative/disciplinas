*[← Voltar ao Guia Anterior](./python.md)*

📋 O que é?

Python é uma linguagem de programação de alto nível, interpretada, de tipagem dinâmica e fortemente tipada (a partir do 3.6+ com type hints). Criada por Guido van Rossum e lançada em 1991, é hoje a linguagem mais usada no mundo (Stack Overflow Survey 2024-2025).

É conhecida por priorizar **legibilidade**, **simplicidade** e **produtividade** do desenvolvedor.

🎯 Filosofia oficial — The Zen of Python (digite `import this` no interpretador)

```text
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Readability counts.
```

🔥 Características que todo dev ama em 2025

- **Sintaxe limpa e intuitiva**  
  ```python
  # Java/C# fariam 15 linhas
  numbers = [1, 2, 3, 4, 5]
  evens = [x for x in numbers if x % 2 == 0]
  ```

- **Baterias inclusas** (biblioteca padrão gigantesca)  
  http, json, datetime, pathlib, threading, asyncio, sqlite, csv, logging, etc.

- **Ecossistema imbatível**  
  - Dados/Ciência: pandas, numpy, matplotlib, jupyter  
  - IA/ML: tensorflow, pytorch, scikit-learn, huggingface  
  - Web: FastAPI, Django, Flask  
  - Automação: selenium, playwright, requests  
  - DevOps: ansible, fabric, docker-sdk

- **Type Hints + mypy/pyright** → Python com segurança de tipos estática (obrigatório em projetos sérios)

✅ Onde Python domina em 2025

| Área                    | Frameworks/Tools mais usados                     |
|-------------------------|---------------------------------------------------|
| APIs REST/GraphQL       | FastAPI (líder absoluto), Django REST, Strawberry |
| Data Science / ML       | pandas, jupyter, polars, pyspark                  |
| Automação & Scripts     | Python puro + rich, typer, click                  |
| Backend corporativo     | FastAPI + SQLAlchemy + Alembic + Pydantic         |
| Microserviços           | FastAPI + Docker + Kubernetes                     |
| IA Generativa           | langchain, llama-index, openai python sdk         |

Estrutura típica de projeto Python moderno (2025)

```plaintext
myproject/
├── src/
│   ├── api/              → routers, schemas (Pydantic)
│   ├── core/             → config, settings, security
│   ├── db/               → models (SQLAlchemy), session
│   ├── services/         → lógica de negócio
│   └── main.py           → FastAPI app
├── tests/
├── pyproject.toml        → poetry ou pdm
├── Dockerfile
└── .python-version
```

Comandos que todo dev Python usa todo dia

```bash
# Gerência de dependências (2025)
poetry add fastapi uvicorn[standard]
pdm add sqlalchemy alembic

# Type checking + lint
ruff check .          # linting ultra-rápido (sucessor do flake8)
mypy .                # type checker
pyright .             # ainda mais rápido que mypy

# Formatação automática
ruff format .         # substituiu black em muitos times
# ou ainda: black . --preview
```

Ferramentas padrão ouro em 2025

| Ferramenta      | O que substituiu                     |
|-----------------|---------------------------------------|
| ruff            | flake8 + isort + pydocstyle + pyupgrade |
| poetry / pdm    | pip + requirements.txt + pipenv       |
| FastAPI         | Flask (quase extinto em novos projetos)|
| Pydantic v2     | dataclasses + manual validation       |
| SQLModel        | SQLAlchemy puro (mais simples)        |

Frase que todo dev Python tem como mantra em 2025
> “Se está difícil de ler, está errado.  
> Se está difícil de testar, está errado.  
> Se está difícil de deployar, está errado.”

Python não é só a linguagem mais amada — é a mais contratada, mais versátil e mais produtiva do planeta em 2025.
