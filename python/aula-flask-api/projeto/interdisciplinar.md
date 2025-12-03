# Proposta de Trabalho Interdisciplinar: Geografia Digital - API dos Estados Brasileiros

## 1. Identificação do Projeto
- **Título:** "Brasil em Dados: Uma API Interativa dos Estados Brasileiros"
- **Disciplinas Envolvidas:** Programação (Técnico em Informática) e Geografia
- **Público-Alvo:** Alunos do 3º ano do Ensino Médio Técnico
- **Duração:** 3 semanas (6 aulas + trabalho extraclasse)
- **Modalidade:** Trabalho em grupos de 3-4 alunos

## 2. Objetivos Interdisciplinares

### Para Programação:
- Desenvolver uma API RESTful com Flask
- Trabalhar com estruturas de dados complexas (JSON aninhados)
- Implementar pesquisa e filtragem de dados
- Praticar organização de código e documentação

### Para Geografia:
- Pesquisar e organizar informações geográficas dos estados brasileiros
- Compreender divisões políticas e territoriais
- Analisar características regionais
- Desenvolver habilidades de pesquisa e síntese de informações

## 3. Descrição do Projeto

Os alunos desenvolverão uma API que permite consultar informações detalhadas sobre os estados brasileiros. A aplicação funcionará como uma base de dados geográfica interativa, onde os usuários podem buscar informações através da sigla do estado.

### Funcionalidades da API:

#### Rotas Principais:
1. **GET /estados** - Lista todos os estados com informações básicas
2. **GET /estados/{sigla}** - Retorna informações completas de um estado específico
3. **GET /estados/{sigla}/cidades** - Lista as principais cidades do estado
4. **GET /estados/{sigla}/fronteiras** - Mostra estados que fazem divisa

#### Estrutura de Dados Completa:
```python
{
    "sigla": "MG",
    "nome": "Minas Gerais",
    "capital": "Belo Horizonte",
    "regiao": "Sudeste",
    "populacao": 21292666,
    "area_km2": 586528.29,
    "gentilico": "mineiro",
    "governador": "Romeu Zema",
    "fronteiras": ["ES", "BA", "GO", "MS", "SP", "RJ"],
    "clima": "Tropical de altitude",
    "relevo": "Planalto e serras",
    "bioma_predominante": "Cerrado e Mata Atlântica",
    "economia": ["Mineração", "Agricultura", "Indústria"],
    "cidades_principais": [
        {"nome": "Belo Horizonte", "populacao": 2530701},
        {"nome": "Uberlândia", "populacao": 699097},
        {"nome": "Contagem", "populacao": 668949}
    ],
    "pontos_turisticos": [
        "Inhotim",
        "Cidades Históricas",
        "Serra do Cipó"
    ],
    "curiosidade": "Maior produtor de café do Brasil"
}
```

## 4. Metodologia de Trabalho

### Fase 1: Pesquisa Geográfica (Geografia - 1ª semana)
Cada grupo será responsável por pesquisar e organizar dados de 2-3 estados brasileiros:
- Dados demográficos e geográficos
- Características econômicas
- Aspectos culturais e turísticos
- Fronteiras e divisas
- Clima e biomas

**Fontes de Pesquisa Sugeridas:**
- IBGE (Instituto Brasileiro de Geografia e Estatística)
- Atlas Geográfico Escolar
- Sites oficiais dos governos estaduais
- Material didático de Geografia

### Fase 2: Desenvolvimento Técnico (Programação - 2ª semana)
Implementação da API seguindo o modelo aprendido em aula:
- Estrutura do projeto Flask
- Rotas e endpoints
- Armazenamento em memória
- Interface de teste
- Validação de dados

### Fase 3: Integração e Testes (3ª semana)
- Compilação de todos os dados pesquisados
- Testes da API completa
- Preparação da apresentação
- Documentação final

## 5. Competências Desenvolvidas

### Habilidades Técnicas (Programação):
- Desenvolvimento Backend com Python/Flask
- Manipulação de dados JSON
- Criação de APIs REST
- Trabalho com versionamento (Git básico)
- Resolução de problemas

### Habilidades Geográficas:
- Pesquisa e análise de dados
- Organização de informações territoriais
- Compreensão de divisões políticas
- Síntese de características regionais
- Apresentação de dados estatísticos

## 6. Recursos Necessários

### Tecnológicos:
- Computadores com Python 3.8+
- Acesso à internet para pesquisa
- Editor de código (VS Code, PyCharm, etc.)
- Navegador web para testes

### Educacionais:
- Material didático de Geografia
- Mapas do Brasil
- Dados do IBGE
- Guias de programação Flask

## 7. Avaliação

### Critérios (100 pontos no total):

**Conteúdo Geográfico (40 pontos):**
- Precisão dos dados (15 pts)
- Completicidade das informações (15 pts)
- Organização da pesquisa (10 pts)

**Desenvolvimento Técnico (40 pontos):**
- Funcionamento da API (20 pts)
- Qualidade do código (10 pts)
- Interface de teste (10 pts)

**Trabalho em Equipe (20 pontos):**
- Colaboração (10 pts)
- Apresentação final (10 pts)

### Produtos a serem entregues:
1. Código fonte completo da API
2. Documentação em README.md
3. Relatório de pesquisa geográfica
4. Apresentação final (5-10 minutos)

## 8. Cronograma Detalhado

| Semana | Atividades (Geografia) | Atividades (Programação) |
|--------|-----------------------|-------------------------|
| 1 | Pesquisa de dados dos estados | Planejamento da estrutura da API |
| 2 | Finalização da pesquisa | Desenvolvimento das rotas principais |
| 3 | Revisão dos dados | Testes, ajustes e preparação da apresentação |

## 9. Benefícios Interdisciplinares

### Para os Alunos:
- Aplicação prática de conceitos de ambas as disciplinas
- Desenvolvimento de projetos reais
- Melhoria na pesquisa e organização de informações
- Experiência com trabalho em equipe multidisciplinar

### Para as Disciplinas:
- Geografia: Dados tornam-se interativos e aplicáveis
- Programação: Contexto real com utilidade prática
- Conexão entre conhecimento teórico e aplicação prática

## 10. Extensões Possíveis (Para Turmas Avançadas)

1. **Interface Web:** Adicionar um frontend simples para visualização dos dados
2. **Comparativos:** Criar rotas para comparar estados (ex: `/comparar/MG/SP`)
3. **Estatísticas:** Endpoints com dados estatísticos (maior população, maior área, etc.)
4. **Mapas Interativos:** Integração com mapas simples usando bibliotecas JavaScript

## 11. Considerações Finais

Este projeto permite que os alunos:
- Vejam a programação como ferramenta para resolver problemas reais
- Compreendam a importância dos dados na representação do território
- Desenvolvam habilidades de pesquisa e organização
- Trabalhem colaborativamente em um projeto significativo

A integração entre Geografia e Programação cria uma oportunidade única para os alunos entenderem como a tecnologia pode ser aplicada para organizar e apresentar conhecimento sobre o mundo real, especificamente sobre seu próprio país.

---

**Preparado por:** [Wellington Dimas Cruz]  
**Disciplina:** Pthon  
**Parceria com:** Geografia  
**Data:** [03/1/2025]  
**Contato:** [wellington.cruz@outlook.com]  

*"Unindo tecnologia e conhecimento do território para compreender melhor o Brasil"*