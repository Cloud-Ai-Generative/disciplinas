# ADR 0004 · Validação escrita à mão, sem biblioteca

- **Status:** aceita
- **Data:** 16/11/2026
- **Responsável:** Bia Ferreira (tech lead)

## Contexto

O desafio exige rejeitar doações inválidas (por exemplo, sem tipo ou com quantidade inválida) com respostas adequadas. As regras combinadas com a Dona Cida:

| Campo | Regra |
|---|---|
| `tipo` | Obrigatório: `alimento`, `roupa` ou `higiene` |
| `descricao` | Obrigatória, até 200 caracteres |
| `quantidade` | Obrigatória, número inteiro maior que zero |
| `data_recebimento` | Obrigatória, formato `AAAA-MM-DD`, sem data futura |
| `doador` | Opcional, até 100 caracteres |

## Decisão

Escrever as regras numa função própria, `validar_doacao()`, no arquivo `app/validacao.py`. Ela devolve **todos** os erros de uma vez, em português.

## Alternativas consideradas

- **Marshmallow ou Pydantic:** bibliotecas maduras de validação. Reduzem código, mas escondem a lógica que a turma precisa entender nesta etapa. Ficam como evolução natural do projeto.

## Consequências

- ✅ Cada regra é uma linha legível, fácil de testar e de mudar.
- ✅ Mensagens em português, pensadas para quem usa o app (o Marcos, na triagem).
- ⚠️ Mais código para manter. Com muitos recursos na API, migrar para uma biblioteca passa a valer a pena.
