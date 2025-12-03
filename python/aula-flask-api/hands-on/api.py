"""
Hands On: API com Flask
Professor: [Wellington Dimas Cruz - Wells]
Data: [03/12/2025]
"""

# 1. IMPORTAÇÕES DE BIBLIOTECAS
# Flask: O framework principal para criar a aplicação web.
# jsonify: Converte dados Python (dicionários) para JSON (formato padrão de APIs).
# request: Permite acessar dados enviados pelo usuário (ex: formulários, JSON).
# render_template: Usado para enviar arquivos HTML prontos para o navegador.
from flask import Flask, jsonify, request, render_template

# requests: Biblioteca para fazer requisições HTTP para outros sites/APIs (cliente).
import requests

# pathlib: Biblioteca moderna para lidar com caminhos de arquivos e pastas (Windows/Linux/Mac).
from pathlib import Path

# sys: Módulo que dá acesso a variáveis e funções do interpretador Python.
import sys

# --------------------------------------------------------------------------------
# 2. CONFIGURAÇÃO DE CAMINHO (IMPORTANTE)
# O Python, por padrão, só procura módulos na pasta atual.
# As linhas abaixo ensinam o Python a olhar em uma pasta específica chamada 'projeto'.

# Path(__file__): Pega o caminho completo deste arquivo .py que você está rodando.
# .parent.parent: Sobe dois níveis na estrutura de pastas (volta duas pastas).
# / 'projeto': Entra na pasta chamada 'projeto'.
caminho_projeto = Path(__file__).parent.parent / 'projeto'

# sys.path.append: Adiciona esse novo caminho à lista de lugares onde o Python busca imports.
# str(): Converte o objeto Path em uma string simples, pois o sys.path espera texto.
sys.path.append(str(caminho_projeto))

# Agora que o caminho foi adicionado, podemos importar módulos de lá.
# Importa a função 'exibir_tela_teste' do arquivo 'api_teste.py' que está dentro da pasta 'projeto'.
from api_teste import exibir_tela_teste

# --------------------------------------------------------------------------------
# 3. INICIALIZAÇÃO DA APLICAÇÃO
# Cria a "alma" do seu site.
# __name__: É uma variável especial. Diz ao Flask onde procurar recursos (templates, estáticos)
# relativos a este arquivo específico.
app = Flask(__name__)

# --------------------------------------------------------------------------------
# 4. BANCO DE DADOS SIMULADO
# Em aplicações reais, usaríamos SQL (Postgres, MySQL) ou DynamoDB (AWS).
# Aqui, usamos uma lista de dicionários Python simples para facilitar o aprendizado.
alunos = [
    {"id": 1, "nome": "Ana Silva", "turma": "3A", "nota": 8.5},
    {"id": 2, "nome": "João Santos", "turma": "3B", "nota": 7.8},
]

#Hands on
# Ver arquivo: hands-on.txt



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

# --------------------------------------------------------------------------------
# 11. EXECUÇÃO DA APLICAÇÃO (MAIN)
# O 'if' abaixo garante que o servidor só inicie se você rodar este arquivo diretamente.
# Se este arquivo fosse importado por outro, o servidor não iniciaria sozinho.
if __name__ == '__main__':
    print("=" * 50)
    print("Hands-on API Flask Iniciada!")
    print("Acesse: http://localhost:5000")
    print("Para testar as rotas:")
    print("=" * 50)

    # Inicia o servidor web de desenvolvimento.
    # host='0.0.0.0': Permite que outros computadores na mesma rede acessem sua API.
    # port=5000: A porta padrão do Flask.
    # debug=True: Se você salvar o arquivo com erros, ele reinicia sozinho e mostra o erro no navegador.
    app.run(host='0.0.0.0', port=5000, debug=True)