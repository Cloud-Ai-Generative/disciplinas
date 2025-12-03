"""
Hands On: API com Flask
Professor: [Wellington Dimas Cruz - Wells]
Data: [03/12/2025]
"""

from flask import Flask, jsonify, request, render_template
import requests
from pathlib import Path
import sys

# Caminho absoluto para a pasta 'projeto'
caminho_projeto = Path(__file__).parent.parent / 'projeto'
sys.path.append(str(caminho_projeto))

from api_teste import exibir_tela_teste

# 1. INICIALIZAÇÃO DA APLICAÇÃO
app = Flask(__name__)



#Hands on


# Fim do Hands On



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