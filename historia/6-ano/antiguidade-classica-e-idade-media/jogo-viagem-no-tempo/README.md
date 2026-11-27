# Viagem no Tempo: da Pólis ao Feudo

Jogo de revisão de História para o 6º ano do Ensino Fundamental: Grécia Antiga, Roma Antiga e Idade Média.

O aluno é um viajante do tempo cuja máquina quebrou. Para voltar para casa, ele recupera 16 engrenagens ajudando personagens fictícios de cada época, com cenários ilustrados, vidas, moedas, combos, dicas, sons (com botão de mudo), um Modo Desafio com cronômetro e uma fase final contra o relógio.

São 16 fases: 10 para as questões das atividades suplementares, 5 extras para as habilidades e capítulos que as questões não cobrem (período helenístico, cristianismo, mulheres na Antiguidade, reinos germânicos, e escravidão × servidão × trabalho livre) e uma de tempo histórico (a.C./d.C. e séculos). Em cada fase o aluno:

1. joga um minijogo (classificar, verdadeiro ou falso, ligar pares, ordenar ou quiz);
2. ganha até 3 estrelas e desbloqueia palavras do **dicionário histórico**;
3. vê a questão original, um roteiro de como montar a resposta e um **exemplo de resposta** comentado, para depois escrever com as próprias palavras no caderno.

Habilidades da BNCC: EF06HI09, EF06HI10, EF06HI12, EF06HI13, EF06HI15, EF06HI16, EF06HI17 e EF06HI19.

Além das fases:

- **Trilha:** checklist de cada capítulo (leitura, síntese, vídeos, questões do livro, Eureka e avaliações), com um roteiro de perguntas para a síntese.
- **Vidas extras:** comprar com moedas (15🪙, até 5 vidas), +1 vida a cada 5 acertos seguidos, coração reserva para quem termina uma fase sem erros, e segunda chance (responder o significado de 2 palavras do dicionário; cada acerto devolve 1 vida). As estrelas dependem dos erros, não das vidas.
- **Monte a resposta:** antes de ver a resposta-modelo, o aluno ordena as frases que a formam. Depois escreve a sua própria resposta e confere com um checklist de autoavaliação. As respostas ficam salvas e aparecem na Trilha para imprimir.
- **Feedback que ensina:** cada erro mostra uma pista específica, sem entregar a resposta.
- **Revisar meus erros:** as perguntas erradas vão para uma revisão sem relógio, e o Desafio Final prioriza essas perguntas.
- **Leitura apoiada:** palavras do dicionário aparecem sublinhadas nos textos e mostram o significado ao tocar; o botão 🔈 lê o texto em voz alta.
- **Fontes históricas:** trechos adaptados (Péricles, Lei das Doze Tábuas, Adalberão de Laon, registro de obrigações feudais) com perguntas de interpretação.
- **Mapa do Mediterrâneo:** na questão 5, o aluno arrasta os produtos até as regiões do mapa.
- **Linha do tempo:** painel com os principais acontecimentos e a explicação de a.C., d.C. e séculos.
- **Meu desempenho:** relatório de acertos por habilidade da BNCC e por fase, para imprimir.
- **Acessibilidade:** botões de letra grande (Aa) e alto contraste (◐).
- **Meu dicionário:** o aluno anota as palavras que não conhecia. Pode ser impresso.

## Como publicar no GitHub Pages

1. Crie um repositório e envie o arquivo `index.html` (e este README).
2. No repositório, abra **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, depois a branch `main` e a pasta `/ (root)`, e clique em **Save**.
4. Em cerca de 1 minuto, o jogo fica disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Detalhes técnicos

- É um único arquivo HTML, sem bibliotecas e sem internet: funciona até abrindo o arquivo direto no computador.
- O progresso fica salvo no navegador do aluno (localStorage). O botão "Recomeçar do zero" apaga tudo.
- Funciona no celular e no computador.
- Para editar perguntas ou respostas, altere o array `LEVELS` dentro do `<script>`.
