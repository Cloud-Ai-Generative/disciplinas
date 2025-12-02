```markdown
# 🐍 Projeto: Primeira API com Flask

Este projeto é uma aplicação educativa desenvolvida em Python utilizando o framework Flask. O sistema simula uma API RESTful completa para o gerenciamento de uma turma de alunos, demonstrando conceitos fundamentais como rotas, métodos HTTP (GET, POST, PUT, DELETE) e respostas em JSON.

Além da API, o projeto inclui uma interface visual de boas-vindas e uma ferramenta integrada ("API Tester") que permite testar as requisições diretamente pelo navegador, sem a necessidade de softwares externos como Postman ou Insomnia.

## 📂 Estrutura do Projeto

O projeto é composto por três arquivos principais, organizados da seguinte forma:

```
/meu-projeto-api
  ├── api.py
  ├── api_teste.py
  └── templates/
       └── home.html
```

### 1. **api.py** (Core da Aplicação)
Este é o arquivo principal que inicializa o servidor Flask.
- **Função:** Define todas as rotas (endpoints) da API e a lógica de negócio.
- **Funcionalidades:** Implementa o CRUD (Create, Read, Update, Delete) de alunos utilizando uma lista em memória para persistência de dados.
- **Rotas Especiais:** Contém rotas de proxy (`/proxy`) que permitem que a ferramenta de teste interna funcione contornando restrições de CORS.

### 2. **templates/home.html** (Interface Visual)
É a página inicial da aplicação (Landing Page).
- **Função:** Fornece uma interface gráfica amigável quando o utilizador acessa a raiz do projeto (`/`).
- **Conteúdo:** Apresenta a documentação das rotas disponíveis e um botão de acesso rápido à ferramenta de testes.
- **Nota:** O Flask exige que este arquivo esteja dentro de uma pasta chamada `templates` para ser renderizado corretamente.

### 3. **api_teste.py** (Ferramenta de Teste)
Um módulo auxiliar contendo uma interface de teste completa.
- **Função:** Renderiza uma interface HTML/CSS/JS moderna (estilo "Thunder Client") para testar a API.
- **Destaque:** Permite ao aluno enviar requisições e visualizar o status code, tempo de resposta e o corpo da resposta JSON em tempo real.

## 🚀 Como Rodar o Projeto

Siga as instruções abaixo de acordo com o seu sistema operacional para configurar o ambiente e rodar a aplicação.

### 📋 Pré-requisitos

Certifique-se de que a sua estrutura de pastas está organizada conforme mostrado acima.

---

### 🐧 Para Linux / macOS

1. **Criar o ambiente virtual (.venv):**
   ```bash
   python3 -m venv .venv
   ```

2. **Ativar o ambiente virtual:**
   ```bash
   source .venv/bin/activate
   ```

3. **Instalar as dependências:**
   ```bash
   pip install flask requests
   ```

4. **Verificar instalação (Opcional):**
   ```bash
   pip list
   ```

5. **Executar a aplicação:**
   ```bash
   python api.py
   ```

---

### 🪟 Para Windows

1. **Criar o ambiente virtual (.venv):**
   Abra o terminal (CMD ou PowerShell) na pasta do projeto e digite:
   ```bash
   python -m venv .venv
   ```

2. **Ativar o ambiente virtual:**

   **Opção A: No PowerShell**
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
   *(Se aparecer um erro de permissão, execute antes: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`)*

   **Opção B: No CMD (Prompt de Comando)**
   ```cmd
   .venv\Scripts\activate.bat
   ```

3. **Instalar as dependências:**
   ```bash
   pip install flask requests
   ```

4. **Executar a aplicação:**
   ```bash
   python api.py
   ```

## 🎮 Como Usar

Após executar o comando para rodar a aplicação, verá uma mensagem indicando que o servidor está online (geralmente em `http://0.0.0.0:5000` ou `http://127.0.0.1:5000`).

1. **Aceder à Home:** Abra o seu navegador e vá para `http://localhost:5000`.
2. **Testar a API:** Na página inicial, clique no botão **"CLIQUE AQUI PARA TESTAR API"** ou aceda diretamente a `http://localhost:5000/teste`.

### Rotas Principais para Teste:
- `GET /alunos`: Lista todos os alunos cadastrados.
- `POST /alunos`: Cria um novo aluno (Exige JSON no corpo da requisição).
- `PUT /alunos/<id>`: Atualiza os dados de um aluno específico.
- `DELETE /alunos/<id>`: Remove um aluno da lista.

## 📝 Créditos

- **Professor:** Wellington Dimas Cruz - Wells
- **Data:** 03/12/2025
```