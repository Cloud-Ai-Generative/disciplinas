# API de doações · Associação Comunitária Vila Esperança

API RESTful para registrar as doações recebidas pela Associação Comunitária Vila Esperança (instituição fictícia, em Contagem/MG). Projeto da Unidade Curricular **Desenvolvimento Back-end**, feito com **Python (Flask)**, **PostgreSQL** e **Docker Compose**.

📘 **Objeto Digital de Aprendizagem (ODA):** <https://cloud-ai-generative.github.io/disciplinas/desenvolvimento-back-end-senac/>
O ODA explica cada etapa, passo a passo, inclusive como instalar o ambiente do zero.

## Do que você precisa

Só de **Git**, **Docker** (com Docker Compose) e **VS Code**. Você **não** precisa instalar Python nem PostgreSQL: tudo roda em contêineres ([ADR 0003](docs/adr/0003-docker-compose-para-o-ambiente.md)).

Sem Docker na máquina? Use o **GitHub Codespaces** (veja o ODA, trilha "Antes da aula").

## Como rodar

```bash
git clone https://github.com/Cloud-Ai-Generative/disciplinas.git
cd disciplinas/desenvolvimento-back-end-senac/api
cp .env.example .env            # no Windows (PowerShell): copy .env.example .env
docker compose up -d --build
docker compose ps               # db e api devem aparecer como "healthy"
```

Teste: abra <http://localhost:8000/doacoes> no navegador. Você deve ver as 5 doações de exemplo.

Para enviar requisições, abra o arquivo `requests.http` no VS Code (extensão **REST Client**) e clique em **Send Request**.

## Rotas

| Verbo | Rota | O que faz | Respostas |
|---|---|---|---|
| `GET` | `/doacoes` | Lista as doações | `200` |
| `GET` | `/doacoes/{id}` | Consulta uma doação | `200`, `404` |
| `POST` | `/doacoes` | Cadastra uma doação | `201`, `400` |
| `PUT` | `/doacoes/{id}` | Atualiza uma doação | `200`, `400`, `404` |
| `DELETE` | `/doacoes/{id}` | Exclui uma doação | `204`, `404` |
| `GET` | `/saude` | Verifica a API e o banco | `200` |

Exemplo de doação:

```json
{
  "tipo": "alimento",
  "descricao": "Pacote de arroz 5 kg",
  "quantidade": 10,
  "data_recebimento": "2026-11-03",
  "doador": "Mercearia do Zé"
}
```

Regras: `tipo` é `alimento`, `roupa` ou `higiene`; `quantidade` é inteiro maior que zero; `data_recebimento` no formato `AAAA-MM-DD`, sem data futura; `doador` é opcional. Erros voltam com status `400` e a lista de problemas:

```json
{ "erros": ["tipo é obrigatório", "quantidade deve ser maior que zero"] }
```

## Comandos úteis

| Para | Comando |
|---|---|
| Ver os logs da API | `docker compose logs -f api` |
| Rodar os testes automatizados | `docker compose exec api pytest` |
| Abrir o banco no terminal | `docker compose exec db psql -U vila -d doacoes` |
| Parar tudo (mantém os dados) | `docker compose down` |
| Zerar o banco e começar de novo | `docker compose down -v` e depois `docker compose up -d` |

## Estrutura

```
api/
├── app/
│   ├── __init__.py      create_app(): monta a aplicação
│   ├── config.py        configuração lida do ambiente (.env)
│   ├── extensions.py    o objeto db
│   ├── models.py        o modelo Doacao
│   ├── validacao.py     as regras de validação
│   ├── routes.py        as rotas de /doacoes
│   ├── erros.py         o formato único de erro
│   └── cli.py           o comando "flask seed"
├── tests/               testes automatizados (pytest)
├── docs/adr/            decisões de arquitetura
├── requests.http        requisições prontas (REST Client)
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Etapas da aula (tags do Git)

Cada etapa da aula está marcada com uma tag. Para ver o código exatamente como estava naquele momento:

```bash
git fetch --tags
git checkout backend-senac-etapa-5
```

| Tag | O que já existe |
|---|---|
| `backend-senac-etapa-3` | Ambiente: Docker Compose, app factory, rota `/saude` |
| `backend-senac-etapa-4` | Modelo `Doacao`, doações de exemplo, rotas `GET` |
| `backend-senac-etapa-5` | Cadastro (`POST`) com validação e erros |
| `backend-senac-etapa-7` | Desafio resolvido: `PUT` e `DELETE` (gabarito) |

Para voltar à versão mais recente: `git checkout main`.

## Decisões de arquitetura

Leia os [ADRs](docs/adr/README.md) para entender **por que** o projeto é assim.
