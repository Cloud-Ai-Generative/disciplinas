# Decisões de arquitetura (ADRs)

Um **ADR** (Architecture Decision Record) registra uma decisão de arquitetura: o contexto, o que foi decidido, as alternativas consideradas e as consequências. Quando alguém perguntar "por que foi feito assim?", a resposta está aqui.

Todas as decisões foram tomadas pela **Bia Ferreira**, tech lead do Laboratório de Inovação e Extensão, junto com a turma de Desenvolvimento Back-end.

| Nº | Decisão | Status |
|----|---------|--------|
| [0001](0001-flask-como-framework.md) | Flask como framework da API | Aceita |
| [0002](0002-postgresql-como-banco.md) | PostgreSQL como banco de dados | Aceita |
| [0003](0003-docker-compose-para-o-ambiente.md) | Docker Compose para todo o ambiente | Aceita |
| [0004](0004-validacao-manual.md) | Validação escrita à mão, sem biblioteca | Aceita |
| [0005](0005-estrutura-em-camadas.md) | App factory, blueprint, modelo e validação separados | Aceita |
| [0006](0006-configuracao-por-env.md) | Configuração por variáveis de ambiente (.env) | Aceita |
| [0007](0007-formato-de-erro.md) | Formato único de erro em JSON e códigos de status | Aceita |
| [0008](0008-create-all-em-vez-de-migrations.md) | `db.create_all()` em vez de migrations, por enquanto | Aceita |

Modelo de cada ADR: **Contexto → Decisão → Alternativas consideradas → Consequências**.
