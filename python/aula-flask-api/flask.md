*[← Voltar ao Guia Anterior](./introducao.md)*

### 🎯 **Definição:**
**Flask** é um **microframework web** escrito em Python. É chamado de "micro" não porque é pequeno em funcionalidades, mas porque mantém um **núcleo simples** enquanto permite extensões.

### 🧩 **Em resumo com Flask você cria sites🌍 e APIs🔌 no Python**

### 🧩 **Pense no Flask como:**

#### 1. **Kit de Ferramentas Básico** 🧰
- Tem o essencial para construir uma casa (app web)
- Você adiciona só as ferramentas que precisa
- Não vem com coisas desnecessárias

#### 2. **Lego para Desenvolvedores** 🧱
- Peças básicas que você combina como quiser
- Flexibilidade total na construção
- Começa simples, pode ficar complexo

#### 3. **Caderno em Branco** 📓
- Você escreve a história do seu app
- Total liberdade na estrutura
- Sem regras rígidas impostas

### ⚡ **Por que Flask para APIs?**

| Vantagem | Ícone | Explicação |
|----------|--------|------------|
| **Simplicidade** | 🎈 | Fácil de aprender e usar |
| **Flexibilidade** | 🎭 | Você escolhe como estruturar |
| **Leveza** | 🪶 | Consome poucos recursos |
| **Python Puro** | 🐍 | Usa toda força do Python |
| **Comunidade Grande** | 👥 | Muita documentação e ajuda |

### 📦 **O que Flask NÃO tem (e por isso é "micro"):**
- ❌ Não tem ORM próprio (usa SQLAlchemy, Peewee)
- ❌ Não tem sistema de autenticação pronto
- ❌ Não tem admin panel automático
- ❌ Não impõe estrutura de pastas

### 🔌 **Mas você PODE adicionar:**
- ✅ **Flask-SQLAlchemy** - Banco de dados
- ✅ **Flask-Login** - Autenticação de usuários
- ✅ **Flask-Admin** - Painel administrativo
- ✅ **Flask-RESTful** - Para APIs mais complexas
- ✅ **Flask-CORS** - Permitir acesso cruzado

### 🚀 **Flask vs Outros Frameworks:**

| Framework | Ícone | Filosofia | Melhor Para |
|-----------|--------|-----------|-------------|
| **Flask** | 🎯 | "Faça você mesmo" | APIs, protótipos, apps simples |
| **Django** | 🏰 | "Baterias incluídas" | Apps complexos, CMS, e-commerce |
| **FastAPI** | ⚡ | "Alta performance" | APIs rápidas, documentação automática |

### 💻 **Exemplo "Hello World" com Flask:**

```python
# app.py - Aplicação mais simples do mundo!
from flask import Flask

# 1. Criar a aplicação Flask
app = Flask(__name__)

# 2. Definir uma rota
@app.route('/')
def hello_world():
    return 'Olá, turma de Python! 🐍'

# 3. Rodar o servidor
if __name__ == '__main__':
    app.run(debug=True)
```

**Para executar:**
```bash
python app.py
# Acesse: http://localhost:5000
```

### 🏗️ **Estrutura Básica de um App Flask:**
```
meu_app_flask/
├── app.py              # Aplicação principal
├── requirements.txt    # Dependências
├── static/            # CSS, JS, imagens
│   ├── style.css
│   └── script.js
├── templates/         # HTML templates
│   └── index.html
└── venv/              # Ambiente virtual (opcional)
```

### 🔗 **Exemplo de API Simples com Flask:**

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

# Dados em memória (simulando banco de dados)
alunos = [
    {"id": 1, "nome": "Ana", "nota": 9.5},
    {"id": 2, "nome": "João", "nota": 8.0}
]

# Rota GET - Listar todos os alunos
@app.route('/alunos', methods=['GET'])
def listar_alunos():
    return jsonify(alunos)

# Rota GET - Buscar aluno por ID
@app.route('/alunos/<int:id>', methods=['GET'])
def buscar_aluno(id):
    for aluno in alunos:
        if aluno['id'] == id:
            return jsonify(aluno)
    return jsonify({"erro": "Aluno não encontrado"}), 404

# Rota POST - Criar novo aluno
@app.route('/alunos', methods=['POST'])
def criar_aluno():
    novo_aluno = request.get_json()
    alunos.append(novo_aluno)
    return jsonify({"mensagem": "Aluno criado!"}), 201

if __name__ == '__main__':
    app.run(debug=True)
```

### 📚 **Recursos para Aprender Flask:**

| Recurso | Ícone | Link |
|---------|--------|------|
| **Documentação Oficial** | 📖 | [flask.palletsprojects.com](https://flask.palletsprojects.com/) |
| **Tutorial em Português** | 🇧🇷 | [Flask Tutorial - Python Academy](https://pythonacademy.com.br/blog/flask-o-micro-framework-web-em-python) |
| **Curso Gratuito** | 🎓 | [Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world) |
| **Vídeo Aulas** | 📹 | [Flask para Iniciantes - YouTube](https://www.youtube.com/results?search_query=flask+para+iniciantes+português) |
