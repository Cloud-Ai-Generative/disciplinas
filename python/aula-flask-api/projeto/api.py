"""
AULA PRÁTICA: Criando sua primeira API com Flask
Professor: [Wellington Dimas Cruz - Wells]
Data: [20/01/2026]
"""

# 1. IMPORTAÇÕES DE BIBLIOTECAS
# Flask: O framework principal para criar a aplicação web.
# jsonify: Converte dados Python (dicionários) para JSON (formato padrão de APIs).
# request: Permite acessar dados enviados pelo usuário (ex: formulários, JSON).
# render_template: Usado para enviar arquivos HTML prontos para o navegador.
from flask import Flask, jsonify, request, render_template
import requests
# Importa a função 'exibir_tela_teste' do arquivo 'api_teste.py' 
from api_teste import exibir_tela_teste


# --------------------------------------------------------------------------------
# 2. INICIALIZAÇÃO DA APLICAÇÃO
# Cria a "alma" do seu site.
# __name__: É uma variável especial. Diz ao Flask onde procurar recursos (templates, estáticos)
# relativos a este arquivo específico.
app = Flask(__name__)

# --------------------------------------------------------------------------------
# 3. BANCO DE DADOS SIMULADO
# Em aplicações reais, usaríamos SQL (Postgres, MySQL) ou DynamoDB (AWS).
# Aqui, usamos uma lista de dicionários Python simples para facilitar o aprendizado.
alunos = [
    {"id": 1, "nome": "Ana Silva", "turma": "3A", "nota": 8.5},
    {"id": 2, "nome": "João Santos", "turma": "3B", "nota": 7.8},
]

# 4. ROTAS BÁSICAS - CRUD de Alunos
@app.route('/')
def home():
    """
    Renderiza a página inicial da aplicação web usando um template HTML.
    
    Retorna:
        Response: Arquivo 'home.html' renderizado pelo mecanismo de templates do Flask.
    """
    return render_template("home.html")

# 5. GET - Listar todos os alunos
@app.route('/alunos', methods=['GET'])
def listar_alunos():
    """
    Retorna uma lista com todos os alunos cadastrados no sistema.
    
    Resposta:
        JSON contendo:
        - "total": número total de alunos
        - "alunos": lista completa de registros
    """
    return jsonify({
        "total": len(alunos),
        "alunos": alunos
    })

# 6. GET - Buscar aluno específico
@app.route('/alunos/<int:aluno_id>', methods=['GET'])
def buscar_aluno(aluno_id):
    """
    Busca um aluno pelo seu ID único.
    
    Parâmetro de rota:
        aluno_id (int): identificador do aluno a ser buscado.
    
    Resposta:
        - Se encontrado: JSON com os dados do aluno (status 200).
        - Se não encontrado: JSON com mensagem de erro (status 404).
    """
    aluno = next((a for a in alunos if a['id'] == aluno_id), None)
    
    if aluno:
        return jsonify(aluno)
    else:
        return jsonify({"erro": "Aluno não encontrado"}), 404

# 7. POST - Criar novo aluno
@app.route('/alunos', methods=['POST'])
def criar_aluno():
    """
    Cria um novo registro de aluno com base nos dados enviados no corpo da requisição (JSON).
    
    Corpo esperado (JSON):
        - "nome" (obrigatório): nome completo do aluno.
        - "turma" (opcional): turma do aluno (padrão: "3A").
        - "nota" (opcional): nota do aluno (padrão: 0.0).
    
    Comportamento:
        - Gera automaticamente um novo ID sequencial (último ID + 1).
        - Valida se o campo "nome" foi fornecido.
    
    Resposta:
        - Sucesso: JSON com mensagem e dados do aluno criado (status 201).
        - Erro: JSON com mensagem de erro (status 400 ou 500).
    """
    try:
        dados = request.get_json()
        
        # Validação básica
        if not dados or not dados.get('nome'):
            return jsonify({"erro": "Nome é obrigatório"}), 400
        
        # Cria novo aluno
        novo_aluno = {
            "id": len(alunos) + 1,
            "nome": dados['nome'],
            "turma": dados.get('turma', '3A'),
            "nota": float(dados.get('nota', 0.0))
        }
        
        alunos.append(novo_aluno)
        
        return jsonify({
            "mensagem": "Aluno criado com sucesso!",
            "aluno": novo_aluno
        }), 201
        
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# 8. PUT - Atualizar aluno (IMPLEMENTADO)
@app.route('/alunos/<int:aluno_id>', methods=['PUT'])
def atualizar_aluno(aluno_id):
    """
    Atualiza parcialmente os dados de um aluno existente.
    
    Parâmetro de rota:
        aluno_id (int): ID do aluno a ser atualizado.
    
    Corpo esperado (JSON, campos opcionais):
        - "nome", "turma", "nota" (qualquer combinação).
    
    Comportamento:
        - Mantém os valores antigos para campos não enviados.
        - Não altera o ID do aluno.
    
    Resposta:
        - Sucesso: JSON com mensagem e dados atualizados (status 200).
        - Erro: JSON com mensagem de erro (status 404 se aluno não existir).
    """
    # Busca o aluno na lista
    aluno = next((a for a in alunos if a['id'] == aluno_id), None)

    if not aluno:
        return jsonify({"erro": "Aluno não encontrado"}), 404

    # Pega os novos dados
    dados = request.get_json()

    # Atualiza os campos (mantém o antigo se não vier o novo)
    aluno['nome'] = dados.get('nome', aluno['nome'])
    aluno['turma'] = dados.get('turma', aluno['turma'])
    aluno['nota'] = float(dados.get('nota', aluno['nota']))

    return jsonify({
        "mensagem": "Aluno atualizado com sucesso!",
        "aluno": aluno
    }), 200

# 9. DELETE - Remover aluno (IMPLEMENTADO)
@app.route('/alunos/<int:aluno_id>', methods=['DELETE'])
def remover_aluno(aluno_id):
    """
    Remove permanentemente um aluno do banco de dados simulado.
    
    Parâmetro de rota:
        aluno_id (int): ID do aluno a ser removido.
    
    Comportamento:
        - Recria a lista global 'alunos' sem o registro especificado.
    
    Resposta:
        - Sucesso: JSON com mensagem de confirmação (status 200).
        - Erro: JSON com mensagem de erro (status 404 se aluno não existir).
    """
    global alunos
    
    # Verifica se o aluno existe antes de tentar deletar
    aluno = next((a for a in alunos if a['id'] == aluno_id), None)
    
    if not aluno:
        return jsonify({"erro": "Aluno não encontrado"}), 404
    
    # Recria a lista mantendo apenas quem tem ID diferente do solicitado
    alunos = [a for a in alunos if a['id'] != aluno_id]
    
    return jsonify({"mensagem": "Aluno removido com sucesso!"}), 200

# 10. ROTA DE STATUS
@app.route('/status', methods=['GET'])
def status_api():
    """
    Verifica se a API está operacional e retorna métricas básicas.
    
    Resposta:
        JSON com:
        - "status": "online"
        - "total_alunos": número atual de registros
        - "mensagem": confirmação de funcionamento
    """
    return jsonify({
        "status": "online",
        "total_alunos": len(alunos),
        "mensagem": "API funcionando perfeitamente!"
    })

# 11. ROTA DE TESTES DE API
@app.route('/teste', methods=['GET'])
def teste_api():
    """
    Carrega uma interface de teste externa (definida em outro módulo).
    
    Utilidade:
        - Permite testar endpoints da API via interface web interativa.
    
    Retorno:
        - O que for retornado pela função 'exibir_tela_teste()' do módulo 'api_teste'.
    """
    # Chamamos a função que está no outro arquivo
    return exibir_tela_teste()

# 12. Rota auxiliar que faz a "mágica" acontecer na rota de testes acima
@app.route('/proxy', methods=['POST'])
def proxy_request():
    """
    Atua como proxy HTTP para permitir que a interface de teste faça requisições a APIs externas.
    
    Motivo:
        - Evita problemas de CORS (Cross-Origin Resource Sharing) no navegador.
    
    Corpo esperado (JSON):
        - "method": método HTTP ("GET", "POST", etc.)
        - "url": URL completa do endpoint alvo
        - "headers": dicionário de cabeçalhos (opcional)
        - "body": corpo da requisição (opcional, para POST/PUT)
    
    Resposta:
        - JSON com:
            - "status": código HTTP da resposta real
            - "status_text": motivo (ex: "OK", "Not Found")
            - "body": conteúdo da resposta
        - Ou erro com status 500 em caso de falha na requisição.
    """
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

# --------------------------------------------------------------------------------
# 13. EXECUÇÃO DA APLICAÇÃO (MAIN)
# O 'if' abaixo garante que o servidor só inicie se você rodar este arquivo diretamente.
# Se este arquivo fosse importado por outro, o servidor não iniciaria sozinho.
if __name__ == '__main__':
    print("=" * 50)
    print("API Flask da Aula Iniciada!")
    print("Acesse: http://localhost:5000")
    print("Para testar as rotas:")
    print("  • GET /alunos - Listar alunos")
    print("  • POST /alunos - Criar aluno")
    print("=" * 50)

    # Inicia o servidor web de desenvolvimento.
    # host='0.0.0.0': Permite que outros computadores na mesma rede acessem sua API.
    # port=5000: A porta padrão do Flask.
    # debug=True: Se você salvar o arquivo com erros, ele reinicia sozinho e mostra o erro no navegador.
    app.run(host='0.0.0.0', port=5000, debug=True)