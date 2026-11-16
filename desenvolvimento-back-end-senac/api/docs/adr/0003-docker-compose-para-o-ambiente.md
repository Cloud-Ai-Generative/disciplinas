# ADR 0003 · Docker Compose para todo o ambiente

- **Status:** aceita
- **Data:** 16/11/2026
- **Responsável:** Bia Ferreira (tech lead)

## Contexto

A turma usa Windows, macOS e Linux, com versões diferentes de Python. Instalar PostgreSQL em cada máquina gera o clássico "na minha máquina funciona". O projeto também precisa rodar igual no computador do Laboratório e, no futuro, num servidor.

## Decisão

Rodar **tudo** com **Docker Compose**: um contêiner para o PostgreSQL e outro para a API. O código da máquina é montado dentro do contêiner da API, para que salvar um arquivo recarregue a aplicação.

## Alternativas consideradas

- **Instalar Python e PostgreSQL na máquina:** cada sistema operacional tem um passo a passo diferente, e as versões variam.
- **Só o banco no Docker e a API local:** reduz o problema, mas cada aluno ainda precisaria do Python certo e das dependências instaladas.

## Consequências

- ✅ **O aluno não precisa instalar Python nem PostgreSQL:** só Git, Docker e VS Code.
- ✅ Um comando sobe tudo: `docker compose up -d --build`.
- ✅ A API só sobe depois que o banco está pronto (`depends_on` com `healthcheck`).
- ⚠️ Docker exige memória (8 GB recomendados) e virtualização ligada. Para quem não tem, há o GitHub Codespaces.
