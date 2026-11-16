# ADR 0008 · `db.create_all()` em vez de migrations, por enquanto

- **Status:** aceita
- **Data:** 16/11/2026
- **Responsável:** Bia Ferreira (tech lead)

## Contexto

A tabela `doacoes` precisa existir no banco antes do primeiro uso. Em projetos reais, a estrutura do banco evolui com **migrations**: scripts versionados que criam e alteram tabelas.

## Decisão

Nesta primeira versão, criar as tabelas com `db.create_all()` quando a API sobe. Ele cria as tabelas que ainda não existem e não mexe nas que já existem.

## Alternativas consideradas

- **Flask-Migrate (Alembic):** o caminho certo assim que a estrutura começar a mudar. Exige entender versões de banco, `upgrade` e `downgrade`, um assunto para uma aula própria.

## Consequências

- ✅ Zero passos extras: `docker compose up` e a tabela existe.
- ⚠️ `create_all()` **não altera** tabelas existentes. Se um campo novo for adicionado ao modelo, será preciso zerar o banco (`docker compose down -v`) ou, melhor, adotar o Flask-Migrate.
- 🔜 **Próximo passo:** adotar Flask-Migrate quando o modelo mudar pela primeira vez.
