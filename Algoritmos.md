# Algoritmo: Jogo de Ramificações sobre Conceitos de Computação

```pseudocode
INÍCIO
    ENQUANTO tempo de atividade for menor que 10 minutos FAÇA
        O aluno analisa as opções do Ponto de Partida e faz sua escolha(Quadro 1A localizado na Folha 1 (Centro)).
        
        ESCOLHA tema selecionado pelo aluno

            CASO Inteligência Artificial
                Ir para o Quadro 6F na Folha 3.
                SE o aluno assinalar a Opção [A] ENTÃO
                    Ir para o Quadro 1C na Folha 1 (Reforço).
                    Direcionar para o Quadro 4D na Folha 1 (Exemplo Final).
                SENÃO
                    Ir diretamente para o Quadro 4D na Folha 1 (Exemplo Final).
                FIM SE

            CASO Banco de dados
                Ir para o Quadro 5E na Folha 2.
                SE o aluno assinalar a Opção [A] ENTÃO
                    Ir para o Quadro 4B na Folha 2 (Reforço).
                    Direcionar para o Quadro 2D na Folha 2 (Exemplo Final).
                SENÃO
                    Ir diretamente para o Quadro 2D na Folha 2 (Exemplo Final).
                FIM SE

            CASO Computação em nuvem
                Ir para o Quadro 2B na Folha 1.
                SE o aluno assinalar a Opção [A] ENTÃO
                    Ir para o Quadro 4A na Folha 3 (Reforço).
                    Direcionar para o Quadro 3D na Folha 3 (Exemplo Final).
                SENÃO
                    Ir diretamente para o Quadro 3D na Folha 3 (Exemplo Final).
                FIM SE
        FIM ESCOLHA
        
        SE o estudante atingir o quadro final antes do encerramento do tempo FAÇA
            Orientar o retorno ao Ponto de Partida 1A para iniciar uma rota tecnológica complementar.
        FIM SE
        
    FIM ENQUANTO
FIM
```

# python
```
INICIO = True

while INICIO:
    tempo_atividade = 0
    while tempo_atividade < 10:
        print("O aluno analisa as opções do Ponto de Partida e faz sua escolha (Quadro 1A localizado na Folha 1 (Centro)).")
        print("Escolha um tema: Inteligência Artificial, Banco de dados, Computação em nuvem")
        tema = input("Digite o tema escolhido: ").strip().lower()

        match tema:
            case "inteligência artificial":
                print("Ir para o Quadro 6F na Folha 3.")
                opcao = input("Assinale a Opção [A] (sim/não): ").strip().lower()
                if opcao == "a" or opcao == "sim":
                    print("Ir para o Quadro 1C na Folha 1 (Reforço).")
                    print("Direcionar para o Quadro 4D na Folha 1 (Exemplo Final).")
                else:
                    print("Ir diretamente para o Quadro 4D na Folha 1 (Exemplo Final).")

            case "banco de dados":
                print("Ir para o Quadro 5E na Folha 2.")
                opcao = input("Assinale a Opção [A] (sim/não): ").strip().lower()
                if opcao == "a" or opcao == "sim":
                    print("Ir para o Quadro 4B na Folha 2 (Reforço).")
                    print("Direcionar para o Quadro 2D na Folha 2 (Exemplo Final).")
                else:
                    print("Ir diretamente para o Quadro 2D na Folha 2 (Exemplo Final).")

            case "computação em nuvem":
                print("Ir para o Quadro 2B na Folha 1.")
                opcao = input("Assinale a Opção [A] (sim/não): ").strip().lower()
                if opcao == "a" or opcao == "sim":
                    print("Ir para o Quadro 4A na Folha 3 (Reforço).")
                    print("Direcionar para o Quadro 3D na Folha 3 (Exemplo Final).")
                else:
                    print("Ir diretamente para o Quadro 3D na Folha 3 (Exemplo Final).")

            case _:
                print("Tema inválido. Tente novamente.")
                continue

        resposta = input("O estudante atingiu o quadro final antes do encerramento do tempo? (sim/não): ").strip().lower()
        if resposta == "sim":
            print("Orientar o retorno ao Ponto de Partida 1A para iniciar uma rota tecnológica complementar.")

        tempo_atividade += 1

    print("Tempo encerrado. Interrompa a movimentação dos alunos e abra espaço para debate coletivo.")
    print("Fala de fechamento: palavra-chave ALGORITMO.")
    break
```

# csharp (C#)
```
using System;

class JogoRamificacoes
{
    static void Main()
    {
        int tempoAtividade = 0;

        while (tempoAtividade < 10)
        {
            Console.WriteLine("O aluno analisa as opções do Ponto de Partida e faz sua escolha (Quadro 1A localizado na Folha 1 (Centro)).");
            Console.WriteLine("Escolha um tema: Inteligência Artificial, Banco de dados, Computação em nuvem");
            string tema = Console.ReadLine().Trim().ToLower();

            switch (tema)
            {
                case "inteligência artificial":
                    Console.WriteLine("Ir para o Quadro 6F na Folha 3.");
                    Console.Write("Assinale a Opção [A] (sim/não): ");
                    string opcao = Console.ReadLine().Trim().ToLower();
                    if (opcao == "a" || opcao == "sim")
                    {
                        Console.WriteLine("Ir para o Quadro 1C na Folha 1 (Reforço).");
                        Console.WriteLine("Direcionar para o Quadro 4D na Folha 1 (Exemplo Final).");
                    }
                    else
                    {
                        Console.WriteLine("Ir diretamente para o Quadro 4D na Folha 1 (Exemplo Final).");
                    }
                    break;

                case "banco de dados":
                    Console.WriteLine("Ir para o Quadro 5E na Folha 2.");
                    Console.Write("Assinale a Opção [A] (sim/não): ");
                    opcao = Console.ReadLine().Trim().ToLower();
                    if (opcao == "a" || opcao == "sim")
                    {
                        Console.WriteLine("Ir para o Quadro 4B na Folha 2 (Reforço).");
                        Console.WriteLine("Direcionar para o Quadro 2D na Folha 2 (Exemplo Final).");
                    }
                    else
                    {
                        Console.WriteLine("Ir diretamente para o Quadro 2D na Folha 2 (Exemplo Final).");
                    }
                    break;

                case "computação em nuvem":
                    Console.WriteLine("Ir para o Quadro 2B na Folha 1.");
                    Console.Write("Assinale a Opção [A] (sim/não): ");
                    opcao = Console.ReadLine().Trim().ToLower();
                    if (opcao == "a" || opcao == "sim")
                    {
                        Console.WriteLine("Ir para o Quadro 4A na Folha 3 (Reforço).");
                        Console.WriteLine("Direcionar para o Quadro 3D na Folha 3 (Exemplo Final).");
                    }
                    else
                    {
                        Console.WriteLine("Ir diretamente para o Quadro 3D na Folha 3 (Exemplo Final).");
                    }
                    break;

                default:
                    Console.WriteLine("Tema inválido. Tente novamente.");
                    continue;
            }

            Console.Write("O estudante atingiu o quadro final antes do encerramento do tempo? (sim/não): ");
            string resposta = Console.ReadLine().Trim().ToLower();
            if (resposta == "sim")
            {
                Console.WriteLine("Orientar o retorno ao Ponto de Partida 1A para iniciar uma rota tecnológica complementar.");
            }

            tempoAtividade++;
        }

        Console.WriteLine("Tempo encerrado. Interrompa a movimentação dos alunos e abra espaço para debate coletivo.");
        Console.WriteLine("Fala de fechamento: palavra-chave ALGORITMO.");
    }
}
```

## **O que são Algoritmos?**

Um **algoritmo** é uma sequência finita e organizada de instruções passo a passo, projetada para resolver um problema específico ou executar uma tarefa.

### Características principais:
- **Precisão**: Cada instrução deve ser clara e inequívoca
- **Finito**: Deve ter um início e um fim definidos
- **Eficiência**: Deve resolver o problema usando recursos adequados
- **Generalidade**: Pode ser aplicado a diferentes conjuntos de dados de entrada

### Exemplo prático:
Uma receita de bolo é um algoritmo:
1. Separe os ingredientes
2. Misture a farinha com o açúcar
3. Adicione os ovos e o leite
4. Leve ao forno por 40 minutos
5. Espere esfriar e sirva

> No contexto da computação, algoritmos são a base de todos os programas e sistemas, desde um simples cálculo até redes neurais complexas.

---

## **O que é Linguagem de Programação?**

Uma **linguagem de programação** é um sistema formal de comunicação utilizado para escrever instruções (algoritmos) que podem ser executadas por um computador. Ela funciona como um **intermediário** entre o pensamento humano e o hardware da máquina.

### Níveis das linguagens:

| Tipo | Exemplos | Características |
|------|----------|-----------------|
| **Baixo nível** | Assembly, Código de máquina | Próximo ao hardware, mais rápido, difícil para humanos |
| **Alto nível** | Python, Java, C#, JavaScript | Mais próximo da linguagem humana, mais produtivo |
| **Médio nível** | C, C++ | Equilíbrio entre controle e abstração |

### Paradigmas principais:
- **Imperativo**: Como fazer passo a passo (C, Python)
- **Orientado a objetos**: Baseado em objetos e classes (Java, C#)
- **Funcional**: Baseado em funções puras (Haskell, Lisp)
- **Declarativo**: O que fazer, não como fazer (SQL, HTML)

> Cada linguagem é como uma "ferramenta especializada" — algumas são melhores para desenvolvimento web, outras para inteligência artificial, outras para sistemas embarcados.

---

## **O que são Bugs?**

Um **bug** é um erro, falha ou defeito em um programa de computador que produz um resultado incorreto ou inesperado. O termo ficou famoso em 1947, quando um inseto (mariposa) ficou preso em um relé do computador Mark II, causando uma falha — literalmente um "bug" (bicho) no sistema.

### Tipos comuns de bugs:

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Sintaxe** | Erro nas regras da linguagem | Esquecer um ponto e vírgula em C# |
| **Lógica** | O programa roda mas dá resultado errado | Calcular média como soma/quantidade-1 |
| **Runtime** | Só aparece durante a execução | Dividir um número por zero |
| **Semântico** | Instrução válida mas com sentido errado | Usar `=` ao invés de `==` em condicionais |

### Como evitar e corrigir:
- **Debugging**: Processo de encontrar e corrigir bugs
- **Testes unitários**: Verificar pequenas partes do código isoladamente
- **Revisão de código**: Outro programador analisa o código
- **Tratamento de exceções**: Prever situações de erro no código

> Um famoso ditado na programação: *"Não existem programas sem bugs, apenas bugs ainda não descobertos."*
