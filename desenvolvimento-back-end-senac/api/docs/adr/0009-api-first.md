# ADR 0009 · Contrato antes do código (API First)

- **Status:** aceita
- **Data:** 16/11/2026
- **Responsável:** Bia Ferreira (tech lead), com Ana Julia (Product Owner)

## Contexto

A API de doações será consumida pelo aplicativo que a turma de front-end está construindo em outra unidade curricular. Se cada time começar a programar sem um acordo, o front-end vai supor rotas, campos e respostas que o back-end pode não oferecer, e a integração vira retrabalho.

## Decisão

Adotar **API First**: definir o **contrato** da API (recursos, rotas, verbos, campos, códigos de status e formato de erro) **antes** de escrever o código. O contrato desta versão é:

- a tabela verbo × rota × status (Seção 2 do ODA);
- as regras de validação (ADR 0004) e o formato de erro (ADR 0007);
- o arquivo `requests.http`, com um exemplo executável de cada requisição.

Em projetos reais, o contrato é desenhado **junto com o time de front-end**, a PO e o QA, numa sessão de design. **Para fins didáticos**, nesta aula o time de back-end desenha o contrato e a PO o leva para o front-end validar.

## Alternativas consideradas

- **Code-first:** programar as rotas primeiro e documentar depois. Começa mais rápido, mas o front-end fica esperando o back-end e descobre as diferenças só na integração.
- **Contrato em OpenAPI desde já:** é o padrão de mercado e permite gerar documentação, mocks e testes. Para esta aula, a tabela e o `requests.http` bastam e são mais fáceis de ler.

## Consequências

- ✅ Front-end e back-end trabalham em paralelo, a partir do mesmo acordo.
- ✅ Os casos difíceis (dado inválido, doação inexistente) são decididos antes do código.
- ✅ Mudar o contrato vira uma conversa entre os times, não uma surpresa.
- ⚠️ O contrato vive em uma tabela e em um arquivo `.http`, não em um padrão que ferramentas leem sozinhas.
- 🔜 **Próximo passo:** escrever o contrato em um arquivo `openapi.yaml`, que gera documentação e um servidor de mock para o front-end.
