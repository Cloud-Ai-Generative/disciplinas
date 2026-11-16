# ADR 0006 · Configuração por variáveis de ambiente (.env)

- **Status:** aceita
- **Data:** 16/11/2026
- **Responsável:** Bia Ferreira (tech lead)

## Contexto

A API precisa do endereço e da senha do banco. O repositório é público no GitHub. Senha escrita no código é senha publicada.

## Decisão

Toda configuração vem de **variáveis de ambiente**. Na máquina de desenvolvimento, elas ficam no arquivo `.env`, que **não vai para o GitHub** (está no `.gitignore`). O repositório traz só o modelo, `.env.example`.

## Alternativas consideradas

- **Valores fixos no código:** simples, mas expõe a senha e obriga a mudar o código para trocar de ambiente.
- **Arquivo de configuração versionado:** resolve a troca de ambiente, mas continua expondo segredos.

## Consequências

- ✅ Nenhum segredo no repositório.
- ✅ O mesmo código roda no notebook, no Laboratório ou num servidor, mudando só o ambiente.
- ⚠️ Quem clona precisa lembrar de criar o `.env` (`cp .env.example .env`). Sem ele, a API avisa com uma mensagem clara.
