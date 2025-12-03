# 📚 Proposta de Trabalho: API de Cardápio para Restaurante

*[← Voltar ao Guia Anterior](../introducao.md)*

## 🎯 Objetivo
Desenvolver uma **API RESTful completa** para gerenciamento de pratos em um restaurante, utilizando os conceitos aprendidos na aula sobre Flask.

## 👥 Organização do Grupo
- **Tamanho ideal:** 4 alunos
- **Duração sugerida:** 1 semana
- **Modalidade:** Trabalho em grupo colaborativo

## 📁 Estrutura do Projeto SIMPLIFICADA

```
restaurante-api/
├── api.py                    # Arquivo principal (igual ao da aula)
├── api_teste.py              # Ferramenta de teste (adaptar da aula)
└── templates/
    └── home.html             # Página inicial (adaptar da aula)
```

## 🏗️ Funcionalidades BÁSICAS (CRUD Completo)

### 1. 📋 Rotas da API

| Método | Rota | O que faz? |
|--------|------|------------|
| **GET** | `/pratos` | Mostra todos os pratos |
| **GET** | `/pratos/<id>` | Mostra UM prato específico |
| **POST** | `/pratos` | Adiciona novo prato |
| **PUT** | `/pratos/<id>` | Atualiza um prato |
| **DELETE** | `/pratos/<id>` | Remove um prato |

### 2. 🍽️ Estrutura de UM Prato

Cada prato terá estas informações (em memória):

```python
{
    "id": 1,
    "nome": "Feijoada",
    "descricao": "Prato típico brasileiro",
    "categoria": "Prato Principal",
    "preco": 35.90,
    "disponivel": True
}
```

### 3. 📊 Dados INICIAIS para Testar

No código, comece com estes 3 pratos já cadastrados:

```python
pratos_iniciais = [
    {
        "id": 1,
        "nome": "Strogonoff de Frango",
        "descricao": "Arroz, batata palha e strogonoff",
        "categoria": "Prato Principal",
        "preco": 28.50,
        "disponivel": True
    },
    {
        "id": 2,
        "nome": "Salada Caesar",
        "descricao": "Salada com molho especial",
        "categoria": "Entrada",
        "preco": 18.90,
        "disponivel": True
    },
    {
        "id": 3,
        "nome": "Brownie com Sorvete",
        "descricao": "Brownie quente e sorvete de creme",
        "categoria": "Sobremesa",
        "preco": 15.00,
        "disponivel": True
    }
]
```

## 👥 Divisão SIMPLES de Tarefas

### **Aluno 1:** Rotas de LEITURA (GET)
- Configurar o projeto inicial
- Fazer a rota `/pratos` (listar todos)
- Fazer a rota `/pratos/<id>` (buscar um)

### **Aluno 2:** Rotas de ESCRITA (POST/PUT)
- Fazer a rota `POST /pratos` (criar novo)
- Fazer a rota `PUT /pratos/<id>` (atualizar)

### **Aluno 3:** Rota de EXCLUSÃO e VALIDAÇÕES
- Fazer a rota `DELETE /pratos/<id>` (remover)
- Validar se os dados estão corretos
- Tratar erros (prato não encontrado)

### **Aluno 4:** Interface e TESTES
- Adaptar a página `home.html`
- Adaptar o `api_teste.py` para testar pratos
- Testar TODAS as rotas

## ✅ O que é OBRIGATÓRIO fazer

1. **API funcionando** com todas as 5 rotas
2. **Dados em memória** (igual fizemos na aula)
3. **Respostas em JSON** (como na aula)
4. **Interface de teste** funcionando
5. **Página inicial** com explicações

## 🎮 Como TESTAR (Passo a Passo)

### Teste 1: Listar pratos
```
GET http://localhost:5000/pratos
```
➡️ Deve mostrar os 3 pratos iniciais

### Teste 2: Adicionar novo prato
```
POST http://localhost:5000/pratos
```
Com este JSON no corpo:
```json
{
    "nome": "Macarrão à Carbonara",
    "descricao": "Massa com molho cremoso",
    "categoria": "Prato Principal",
    "preco": 32.00,
    "disponivel": true
}
```

### Teste 3: Atualizar um prato
```
PUT http://localhost:5000/pratos/1
```
```json
{
    "preco": 30.00,
    "disponivel": false
}
```

### Teste 4: Remover um prato
```
DELETE http://localhost:5000/pratos/2
```

## 📝 Entregas (O que apresentar)

### 1. **Código Funcionando**
- Todos os arquivos (api.py, api_teste.py, templates/home.html)
- Projeto roda sem erro

### 2. **Demonstração na Aula** (5 minutos)
- Mostrar a página inicial
- Testar 2-3 rotas no navegador
- Explicar quem fez o quê

### 3. **Pequeno Relatório** (opcional)
- Nomes dos integrantes
- O que cada um fez
- Dificuldades encontradas

## 💡 Dicas IMPORTANTES

### Comece PELO BÁSICO:
```python
# No api.py, comece assim:
from flask import Flask, jsonify, request

app = Flask(__name__)

# Lista em memória (igual na aula)
pratos = [
    # coloque os 3 pratos iniciais aqui
]

# Rota para listar todos
@app.route('/pratos', methods=['GET'])
def get_pratos():
    return jsonify(pratos)

# Depois faça as outras rotas...
```

### Use o CÓDIGO da AULA como BASE:
- A estrutura é IGUAL à que já fizemos
- Só muda o nome de "alunos" para "pratos"
- E os campos são diferentes

### Teste SEMPRE:
1. Rode `python api.py`
2. Abra `http://localhost:5000`
3. Use a ferramenta de teste
4. Verifique se tudo funciona

## 🆘 Se tiver DIFICULDADE

1. **Volte ao código da aula** - Ele já tem 90% do que precisa
2. **Mude apenas**:
   - `alunos` → `pratos`
   - Campos dos alunos → Campos dos pratos
   - Nomes das rotas
3. **Peça ajuda** ao professor ou colegas
4. **Comece devagar** - Faça uma rota de cada vez

## ⏱️ Cronograma Sugerido

| Dia | O que fazer |
|-----|-------------|
| **1** | Aluno 1: Projeto inicial + GET /pratos |
| **2** | Aluno 2: POST /pratos + PUT /pratos |
| **3** | Aluno 3: DELETE /pratos + validações |
| **4** | Aluno 4: Interface + testes |
| **5** | TODOS: Testar tudo juntos + ajustes |

## 🎓 Critérios de Avaliação (Simples)

| Item | Pontos |
|------|--------|
| API funciona completamente | 60 |
| Interface de teste funciona | 20 |
| Trabalho em equipe | 20 |
| **Total** | **100** |

---

**📅 Data de Entrega:** [Definida pelo professor]  
**🎯 Lembrete:** É um trabalho para PRATICAR o que aprendemos!

**Boa sorte e bom trabalho!** 🚀👨‍💻👩‍💻

> *"O importante é tentar, errar, corrigir e aprender!"*