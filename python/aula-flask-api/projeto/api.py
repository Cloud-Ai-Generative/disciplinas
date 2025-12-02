"""
AULA PRÁTICA: Criando sua primeira API com Flask
Professor: [Wellington Dimas Cruz - Wells]
Data: [03/12/2025]
"""

from flask import Flask, jsonify, request, render_template
import requests
# Importamos a função do outro arquivo
from api_teste import exibir_tela_teste


# 1. INICIALIZAÇÃO DA APLICAÇÃO
app = Flask(__name__)

# Banco de dados em memória (para simplificação)
alunos = [
    {"id": 1, "nome": "Ana Silva", "turma": "3A", "nota": 8.5},
    {"id": 2, "nome": "João Santos", "turma": "3B", "nota": 7.8},
]

# 2. ROTAS BÁSICAS - CRUD de Alunos
@app.route('/')
def home():
    return render_template("home.html")

# 3. GET - Listar todos os alunos
@app.route('/alunos', methods=['GET'])
def listar_alunos():
    """Lista todos os alunos cadastrados"""
    return jsonify({
        "total": len(alunos),
        "alunos": alunos
    })

# 4. GET - Buscar aluno específico
@app.route('/alunos/<int:aluno_id>', methods=['GET'])
def buscar_aluno(aluno_id):
    """Busca um aluno pelo ID"""
    aluno = next((a for a in alunos if a['id'] == aluno_id), None)
    
    if aluno:
        return jsonify(aluno)
    else:
        return jsonify({"erro": "Aluno não encontrado"}), 404

# 5. POST - Criar novo aluno
@app.route('/alunos', methods=['POST'])
def criar_aluno():
    """Cria um novo aluno"""
    try:
        dados = request.get_json()
        
        # Validação básica
        if not dados.get('nome'):
            return jsonify({"erro": "Nome é obrigatório"}), 400
        
        # Cria novo aluno
        novo_aluno = {
            "id": len(alunos) + 1,
            "nome": dados['nome'],
            "turma": dados.get('turma', '3A'),
            "nota": dados.get('nota', 0.0)
        }
        
        alunos.append(novo_aluno)
        
        return jsonify({
            "mensagem": "Aluno criado com sucesso!",
            "aluno": novo_aluno
        }), 201
        
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# 6. PUT - Atualizar aluno (IMPLEMENTADO)
@app.route('/alunos/<int:aluno_id>', methods=['PUT'])
def atualizar_aluno(aluno_id):
    """Atualiza dados de um aluno"""
    # Busca o aluno na lista
    aluno = next((a for a in alunos if a['id'] == aluno_id), None)

    if not aluno:
        return jsonify({"erro": "Aluno não encontrado"}), 404

    # Pega os novos dados
    dados = request.get_json()

    # Atualiza os campos (mantém o antigo se não vier o novo)
    aluno['nome'] = dados.get('nome', aluno['nome'])
    aluno['turma'] = dados.get('turma', aluno['turma'])
    aluno['nota'] = dados.get('nota', aluno['nota'])

    return jsonify({
        "mensagem": "Aluno atualizado com sucesso!",
        "aluno": aluno
    }), 200

# 7. DELETE - Remover aluno (IMPLEMENTADO)
@app.route('/alunos/<int:aluno_id>', methods=['DELETE'])
def remover_aluno(aluno_id):
    """Remove um aluno"""
    global alunos
    
    # Verifica se o aluno existe antes de tentar deletar
    aluno = next((a for a in alunos if a['id'] == aluno_id), None)
    
    if not aluno:
        return jsonify({"erro": "Aluno não encontrado"}), 404
    
    # Recria a lista mantendo apenas quem tem ID diferente do solicitado
    alunos = [a for a in alunos if a['id'] != aluno_id]
    
    return jsonify({"mensagem": "Aluno removido com sucesso!"}), 200

# 9. ROTA DE STATUS
@app.route('/status', methods=['GET'])
def status_api():
    """Verifica status da API"""
    return jsonify({
        "status": "online",
        "total_alunos": len(alunos),
        "mensagem": "API funcionando perfeitamente!"
    })

#10. ROTA DE TESTES DE API
@app.route('/teste', methods=['GET'])
def teste_api():
# Chamamos a função que está no outro arquivo
    return exibir_tela_teste()

#11 Rota auxiliar que faz a "mágica" acontecer na rota de testes acima
@app.route('/proxy', methods=['POST'])
def proxy_request():
    data = request.get_json()
    
    # Pega os dados enviados pelo Javascript
    method = data.get('method')
    url = data.get('url')
    headers = data.get('headers', {})
    body = data.get('body')

    try:
        # Faz a requisição real para a API externa
        resp = requests.request(
            method=method,
            url=url,
            headers=headers,
            data=body if body else None
        )
        
        # Devolve o resultado para sua tela de teste
        return jsonify({
            'status': resp.status_code,
            'status_text': resp.reason,
            'body': resp.text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 11. EXECUÇÃO DA APLICAÇÃO
if __name__ == '__main__':
    print("=" * 50)
    print("API Flask da Aula Iniciada!")
    print("Acesse: http://localhost:5000")
    print("Para testar as rotas:")
    print("  • GET /alunos - Listar alunos")
    print("  • POST /alunos - Criar aluno")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)