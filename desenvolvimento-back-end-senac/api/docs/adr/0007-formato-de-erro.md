# ADR 0007 · Formato único de erro em JSON e códigos de status

- **Status:** aceita
- **Data:** 16/11/2026
- **Responsável:** Bia Ferreira (tech lead)

## Contexto

O aplicativo dos voluntários precisa saber se a operação deu certo e, se não deu, mostrar o motivo. Se cada rota respondesse erros de um jeito, o app teria de tratar cada caso separadamente.

## Decisão

1. Usar os códigos de status HTTP pelo significado:

| Situação | Status |
|---|---|
| Consulta ou atualização bem-sucedida | `200 OK` |
| Doação cadastrada (com cabeçalho `Location`) | `201 Created` |
| Doação excluída (sem corpo) | `204 No Content` |
| Dados inválidos | `400 Bad Request` |
| Doação ou rota inexistente | `404 Not Found` |
| Verbo não suportado na rota | `405 Method Not Allowed` |

2. Todo erro sai no mesmo formato, sempre com uma lista:

```json
{ "erros": ["tipo é obrigatório", "quantidade deve ser maior que zero"] }
```

## Alternativas consideradas

- **Problem Details (RFC 9457):** padrão oficial para erros HTTP, com campos como `type`, `title` e `detail`. É o próximo passo natural; aqui, um formato mais simples basta e é mais fácil de ler em aula.
- **Responder sempre 200 com um campo `sucesso`:** esconde o erro do protocolo HTTP e confunde clientes, caches e ferramentas.

## Consequências

- ✅ O app trata qualquer erro com o mesmo código: lê a lista `erros` e mostra.
- ✅ Vários erros voltam de uma vez: o voluntário corrige tudo numa só tentativa.
- ⚠️ Formato próprio: se a API for integrada a outros sistemas, vale migrar para Problem Details.
