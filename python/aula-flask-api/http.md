*[← Voltar ao Guia Anterior](./introducao.md)*

**HTTP** (HyperText Transfer Protocol) é o **protocolo de comunicação** que permite a transferência de informações na Web.

**Pense no HTTP como:**
- 🚚 **Um carteiro digital** que entrega pedidos e respostas
- 📞 **Uma linguagem universal** entre navegadores e servidores
- 🎭 **Um protocolo sem estado** - cada requisição é independente

**Métodos HTTP principais (verbos):**

| Método | Ícone | Descrição | Exemplo Prático |
|--------|--------|-----------|-----------------|
| **GET** | 📥 | Buscar dados | Acessar uma página web |
| **POST** | 📮 | Enviar dados | Enviar um formulário |
| **PUT** | 🔄 | Atualizar completo | Editar perfil |
| **PATCH** | ✏️ | Atualizar parcial | Alterar apenas senha |
| **DELETE** | 🗑️ | Remover dados | Excluir uma conta |

**Códigos de Status HTTP (alguns exemplos):**
- ✅ **200 OK** - Sucesso!
- 🔍 **404 Not Found** - Página não encontrada
- 🚫 **403 Forbidden** - Acesso negado
- ⚠️ **500 Internal Error** - Erro no servidor
- 🔄 **301 Moved** - Redirecionamento permanente

**Exemplo de comunicação HTTP:**
```http
GET /alunos HTTP/1.1
Host: api.escola.com
User-Agent: Mozilla/5.0

HTTP/1.1 200 OK
Content-Type: application/json

{
  "alunos": [
    {"id": 1, "nome": "Ana"},
    {"id": 2, "nome": "João"}
  ]
}
```

🔗 **Saiba mais:** [Protocolo HTTP na Wikipedia](https://pt.wikipedia.org/wiki/HTTP)

---