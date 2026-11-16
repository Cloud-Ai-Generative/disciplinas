# ADR 0002 · PostgreSQL como banco de dados

- **Status:** aceita
- **Data:** 16/11/2026
- **Responsável:** Bia Ferreira (tech lead)

## Contexto

Hoje as doações ficam em cadernos e se perdem. Precisamos de um armazenamento confiável, com várias pessoas voluntárias registrando ao mesmo tempo, e que possa crescer junto com a associação.

## Decisão

Usar **PostgreSQL 17**, executado em contêiner (ADR 0003).

## Alternativas consideradas

- **SQLite:** um arquivo, zero configuração. Excelente para testes (usamos nos testes automatizados), mas não foi feito para vários usuários gravando ao mesmo tempo num servidor.
- **MySQL:** também atenderia. O PostgreSQL foi escolhido por ser livre, muito usado no mercado e rigoroso com tipos e restrições.
- **Banco NoSQL (por exemplo, MongoDB):** os dados de uma doação têm estrutura fixa e conhecida; um banco relacional representa isso naturalmente.

## Consequências

- ✅ Banco robusto, gratuito e padrão de mercado.
- ✅ As restrições (`NOT NULL`, tamanhos) protegem os dados mesmo se a API falhar em validar.
- ⚠️ É mais um serviço para rodar. O Docker Compose resolve isso sem exigir instalação na máquina.
