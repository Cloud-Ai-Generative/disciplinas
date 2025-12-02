from flask import Flask, render_template_string

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Tester - Thunder Style</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1e1e1e;
            color: #d4d4d4;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            background: #252526;
            padding: 15px 20px;
            border-bottom: 1px solid #3e3e42;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .header h1 {
            font-size: 18px;
            font-weight: 500;
            color: #cccccc;
        }
        
        .container {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px;
            overflow: auto;
        }
        
        .request-section {
            background: #252526;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
            color: #cccccc;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .url-input-group {
            display: flex;
            gap: 10px;
        }
        
        select {
            padding: 8px 12px;
            background: #3c3c3c;
            border: 1px solid #3e3e42;
            border-radius: 4px;
            color: #d4d4d4;
            font-size: 14px;
            cursor: pointer;
            min-width: 100px;
        }
        
        input[type="text"], textarea {
            width: 100%;
            padding: 10px 12px;
            background: #3c3c3c;
            border: 1px solid #3e3e42;
            border-radius: 4px;
            color: #d4d4d4;
            font-size: 14px;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        
        input[type="text"]:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #007acc;
        }
        
        textarea {
            min-height: 150px;
            resize: vertical;
        }
        
        .tabs {
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
            border-bottom: 1px solid #3e3e42;
        }
        
        .tab {
            padding: 8px 16px;
            background: transparent;
            border: none;
            color: #cccccc;
            cursor: pointer;
            font-size: 13px;
            border-bottom: 2px solid transparent;
        }
        
        .tab.active {
            color: #007acc;
            border-bottom-color: #007acc;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .header-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .header-row input {
            flex: 1;
        }
        
        .btn-add-header {
            padding: 8px 16px;
            background: #0e639c;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 13px;
        }
        
        .btn-add-header:hover {
            background: #1177bb;
        }
        
        .btn-send {
            padding: 12px 32px;
            background: #0e639c;
            border: none;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .btn-send:hover {
            background: #1177bb;
        }
        
        .btn-send:disabled {
            background: #3e3e42;
            cursor: not-allowed;
        }
        
        .response-section {
            background: #252526;
            border-radius: 6px;
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .response-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #3e3e42;
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .status-success {
            background: #107c10;
            color: white;
        }
        
        .status-error {
            background: #e81123;
            color: white;
        }
        
        .response-time {
            color: #858585;
            font-size: 13px;
        }
        
        .response-body {
            flex: 1;
            background: #1e1e1e;
            border: 1px solid #3e3e42;
            border-radius: 4px;
            padding: 15px;
            overflow: auto;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            line-height: 1.6;
        }
        
        pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #858585;
        }
        
        .btn-remove {
            padding: 6px 12px;
            background: #5a1d1d;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 12px;
        }
        
        .btn-remove:hover {
            background: #7d2828;
        }

        .quick-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .btn-quick {
            padding: 6px 12px;
            background: #3e3e42;
            border: none;
            border-radius: 4px;
            color: #cccccc;
            cursor: pointer;
            font-size: 12px;
        }

        .btn-quick:hover {
            background: #4e4e52;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚡ API Tester</h1>
    </div>
    
    <div class="container">
        <div class="request-section">
            <div class="form-group">
                <label>Request</label>
                <div class="url-input-group">
                    <select id="method">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    <input type="text" id="url" placeholder="http://localhost:5000/api/endpoint" value="http://localhost:5000/">
                    <button class="btn-send" onclick="sendRequest()">Send</button>
                </div>
            </div>

            <div class="tabs">
                <button class="tab active" onclick="switchTab('headers')">Headers</button>
                <button class="tab" onclick="switchTab('body')">Body</button>
            </div>

            <div id="headers-tab" class="tab-content active">
                <div id="headers-container">
                    <div class="header-row">
                        <input type="text" placeholder="Key" class="header-key">
                        <input type="text" placeholder="Value" class="header-value">
                    </div>
                </div>
                <button class="btn-add-header" onclick="addHeader()">+ Add Header</button>
                <div class="quick-actions">
                    <button class="btn-quick" onclick="addContentTypeJson()">Add Content-Type: application/json</button>
                    <button class="btn-quick" onclick="addAuthBearer()">Add Authorization Bearer</button>
                </div>
            </div>

            <div id="body-tab" class="tab-content">
                <div class="form-group">
                    <label>Request Body (JSON)</label>
                    <textarea id="body" placeholder='{\n  "key": "value"\n}'></textarea>
                </div>
            </div>
        </div>

        <div class="response-section">
            <div class="response-header">
                <h3>Response</h3>
                <div id="response-meta"></div>
            </div>
            <div id="response-body" class="response-body">
                <div class="loading">Faça uma requisição para ver a resposta aqui</div>
            </div>
        </div>
    </div>

    <script>
        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tab + '-tab').classList.add('active');
        }

        function addHeader() {
            const container = document.getElementById('headers-container');
            const row = document.createElement('div');
            row.className = 'header-row';
            row.innerHTML = `
                <input type="text" placeholder="Key" class="header-key">
                <input type="text" placeholder="Value" class="header-value">
                <button class="btn-remove" onclick="this.parentElement.remove()">Remove</button>
            `;
            container.appendChild(row);
        }

        function addContentTypeJson() {
            const container = document.getElementById('headers-container');
            const row = document.createElement('div');
            row.className = 'header-row';
            row.innerHTML = `
                <input type="text" placeholder="Key" class="header-key" value="Content-Type">
                <input type="text" placeholder="Value" class="header-value" value="application/json">
                <button class="btn-remove" onclick="this.parentElement.remove()">Remove</button>
            `;
            container.appendChild(row);
        }

        function addAuthBearer() {
            const container = document.getElementById('headers-container');
            const row = document.createElement('div');
            row.className = 'header-row';
            row.innerHTML = `
                <input type="text" placeholder="Key" class="header-key" value="Authorization">
                <input type="text" placeholder="Value" class="header-value" placeholder="Bearer seu-token-aqui">
                <button class="btn-remove" onclick="this.parentElement.remove()">Remove</button>
            `;
            container.appendChild(row);
        }

        async function sendRequest() {
            const method = document.getElementById('method').value;
            const url = document.getElementById('url').value;
            const body = document.getElementById('body').value;
            
            const headers = {};
            document.querySelectorAll('.header-row').forEach(row => {
                const key = row.querySelector('.header-key').value.trim();
                const value = row.querySelector('.header-value').value.trim();
                if (key) headers[key] = value;
            });

            const responseBody = document.getElementById('response-body');
            const responseMeta = document.getElementById('response-meta');
            
            responseBody.innerHTML = '<div class="loading">Enviando requisição...</div>';
            responseMeta.innerHTML = '';

            const startTime = Date.now();

            try {
                const response = await fetch('/proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        method: method,
                        url: url,
                        headers: headers,
                        body: body
                    })
                });

                const data = await response.json();
                const duration = Date.now() - startTime;

                if (data.error) {
                    responseMeta.innerHTML = `
                        <span class="status-badge status-error">ERROR</span>
                        <span class="response-time">${duration}ms</span>
                    `;
                    responseBody.innerHTML = `<pre style="color: #f48771;">${data.error}</pre>`;
                } else {
                    const statusClass = data.status >= 200 && data.status < 300 ? 'status-success' : 'status-error';
                    responseMeta.innerHTML = `
                        <span class="status-badge ${statusClass}">${data.status} ${data.status_text}</span>
                        <span class="response-time">${duration}ms</span>
                    `;
                    
                    let formattedBody = data.body;
                    try {
                        formattedBody = JSON.stringify(JSON.parse(data.body), null, 2);
                    } catch (e) {
                        // Não é JSON, mantém como está
                    }
                    
                    responseBody.innerHTML = `<pre>${formattedBody}</pre>`;
                }
            } catch (error) {
                responseMeta.innerHTML = '<span class="status-badge status-error">ERROR</span>';
                responseBody.innerHTML = `<pre style="color: #f48771;">Erro de conexão: ${error.message}</pre>`;
            }
        }

        // Permitir enviar com Ctrl+Enter no body
        document.getElementById('body').addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                sendRequest();
            }
        });
    </script>
</body>
</html>
'''

# Criamos uma função que será chamada pelo arquivo principal
def exibir_tela_teste():
    # Aqui você pode colocar lógicas adicionais se precisar
    return render_template_string(HTML_TEMPLATE)