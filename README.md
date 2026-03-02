# 🏗️ ObraConnect Refatorado

Um marketplace moderno e simples para conectar profissionais de construção e reformas com clientes.

**Construído com**: HTML5 + Bootstrap + JavaScript (Frontend) | Node.js + Express + MySQL (Backend)

---

## 📋 Sumário

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalação](#instalação-e-configuração)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Credenciais de Teste](#credenciais-de-teste)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

✅ **Autenticação Segura**

- Senha criptografada com bcrypt
- JWT para sessões
- Sistema de tipos de usuário (usuário, prestador, admin)

✅ **Sistema de Serviços**

- Listar todos os serviços (público)
- Criar, editar, deletar serviços (apenas prestadores)
- Upload de imagens
- Categorias de serviços

✅ **Avaliações**

- 4 notas diferentes (preço, tempo, higiene, educação)
- Comentários dos clientes
- Cálculo de média automáta

✅ **Interface Amigável**

- Design responsivo com Bootstrap 5
- Cores profissionais e modernas
- Navegação intuitiva
- Sem dependências externas no frontend (apenas Bootstrap)

---

## 🔧 Requisitos

- **Node.js** 14+ ([Download](https://nodejs.org))
- **MySQL** 5.7+ (já deve estar rodando no XAMPP)
- **Git** (opcional, para clonar)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

---

## 📦 Instalação e Configuração

### Passo 1: Preparar o Banco de Dados

1. Abra o **phpMyAdmin** (http://localhost/phpmyadmin)
2. Crie um novo banco de dados chamado `obraconnect_db` (ou importe o arquivo SQL)
3. Importe o arquivo `_db/obraconnect_db.sql`:
   - Clique em "Importar"
   - Selecione o arquivo SQL
   - Clique em "Executar"

```bash
# Ou via terminal MySQL:
mysql -u root -p obraconnect_db < _db/obraconnect_db.sql
```

### Passo 2: Configurar o Backend

1. Abra a pasta `backend` no terminal:

```bash
cd ObraConnect-refatorado/backend
```

2. Instalar dependências:

```bash
npm install
```

3. Verificar/editar arquivo `.env`:

```bash
# Backend/.env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=obraconnect_db
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456789
```

> **Importante**: Se seu MySQL tem senha, adicione em `DB_PASSWORD=sua_senha`

4. Testar se banco está conectando:

```bash
npm run dev
```

Você deve ver:

```
╔════════════════════════════════════════╗
║    🏗️  OBRACONNECT REFATORADO 🏗️      ║
╠════════════════════════════════════════╣
║  Servidor rodando em: http://localhost:3001
```

✅ Servidor backend rodando!

### Passo 3: Usar o Frontend

1. Abra `frontend/index.html` no navegador:
   - Clique duas vezes no arquivo, ou
   - Arraste para o navegador, ou
   - Use um servidor local (recomendado)


 **Opção sugerida** - Com VS Code Live Server:
   - Instale a extensão "Live Server"
   - Clique com botão direito em `index.html` > "Open with Live Server"

---

## 🚀 Como Usar

### Fluxo Básico

#### 1️⃣ Criar Conta

- Clique em "Registrar"
- Preencha nome, email, usuário e senha
- Você é cadastrado como "usuário" comum

#### 2️⃣ Virar Prestador (opcional)

- Faça login
- No dashboard, clique "Virar Prestador"
- Agora pode anunciar serviços

#### 3️⃣ Anunciar Serviço (apenas prestadores)

- Clique em "Novo Serviço"
- Preencha: Título, Descrição, Categoria, Foto
- O serviço aparece na homepage

#### 4️⃣ Avaliar Serviço

- Veja detalhes de qualquer serviço
- Preencha as 4 notas + comentário
- Avaliação aparece na página do serviço

---

## 📁 Estrutura do Projeto

```
ObraConnect-refatorado/
│
├── backend/                          # 🔧 API Node.js
│   ├── config/
│   │   ├── database.js              # Conexão MySQL
│   │   └── upload.js                # Multer para imagens
│   ├── middlewares/
│   │   └── autenticacao.js          # JWT + verificação
│   ├── routes/
│   │   ├── authRoutes.js            # Login, registro
│   │   ├── servicoRoutes.js         # CRUD serviços
│   │   └── avaliacaoRoutes.js       # CRUD avaliações
│   ├── uploads/                      # Fotos dos serviços
│   ├── index.js                      # Arquivo principal
│   ├── package.json
│   ├── .env                          # Variáveis de ambiente
│   └── .gitignore
│
├── frontend/                         # 🎨 HTML + CSS + JS
│   ├── index.html                   # Homepage
│   ├── style.css                    # Estilos globais
│   ├── pages/
│   │   ├── login.html
│   │   ├── registro.html
│   │   ├── cadastrar-servico.html
│   │   ├── detalhes-servico.html
│   │   └── meu-perfil.html
│   ├── js/
│   │   ├── api.js                   # Funções de API
│   │   ├── auth.js                  # Lógica de autenticação
│   │   └── servicos.js              # Gerenciamento de serviços
│   └── assets/imgs/                 # (opcional) Imagens locais
│
├── _db/
│   └── obraconnect_db.sql           # Script do banco de dados
│
└── README.md                         # Este arquivo
```

---

## 👥 Credenciais de Teste

O banco de dados vem com 4 usuários pré-cadastrados:

| Usuário      | Email                    | Senha    | Tipo      |
| ------------ | ------------------------ | -------- | --------- |
| admin        | xxxxxxxxxxxxxa@gmail.com | admin123 | admin     |
| jose         | jose@email.com           | senha123 | usuario   |
| aline        | aline@teste.com          | senha123 | usuario   |
| jose-antonio | jose.antonio@teste.com   | senha123 | prestador |

**Teste rápido**:

1. Acesse a homepage
2. Clique em "Login"
3. Use `admin` / `senha123`
4. Explore os serviços cadastrados

---

## 🎨 Cores e Design

As cores utilizadas foram baseadas no projeto original:

```css
--azul-marinho: #0b213e /* Navbar, backgrounds */ 
--laranja-principal: #ff6600  /* Botões, destaques */ 
--azul-claro: #e6f3ff /* Backgrounds suaves */
--verde-sucesso: #125c13 /* Mensagens de sucesso */ 
--vermelho-erro: #b71c1c  /* Mensagens de erro */;
```

---

## 🔒 Segurança

✅ **Implementado:**

- Senhas criptografadas com bcrypt (10 salt rounds)
- JWT para autenticação (validade: 7 dias)
- CORS habilitado
- Validação de entrada no servidor
- Proteção de rotas (middleware de autenticação)

⚠️ **Em Produção:**

- Usar HTTPS
- Adicionar rate limiting
- Implementar CSRF protection
- Adicionar logs de segurança
- Usar variáveis de ambiente seguras

---

## 📝 Logs e Debugging

### Ver logs do backend:

```bash
npm run dev
```

Você verá:

```
✅ Conectado ao banco de dados MySQL com sucesso!
Servidor rodando em: http://localhost:3001
```

### Ver erros no navegador:

Pressione `F12` → Aba "Console" para ver erros JavaScript

### Testar API com Postman/CURL:

```bash
# Teste de login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"senha123"}'
```

---

## ⚠️ Troubleshooting

### ❌ "Erro ao conectar no banco de dados"

**Solução**:

- Verificar se MySQL está rodando (XAMPP)
- Verificar `.env` - host, user, password estão corretos?
- Criar banco `obraconnect_db` manualmente no phpMyAdmin
- Importar arquivo SQL

### ❌ "CORS error"

**Solução**:

- Certificar que backend está rodando na porta 3001
- Certificar que frontend está accesando `http://localhost:3001/api`

### ❌ "imagens não aparecem"

**Solução**:

- Pasta `backend/uploads/` existe?
- Estar servindo a pasta com `app.use('/uploads', express.static(...))`
- Verificar se arquivo foi salvo corretamente

### ❌ "Botão 'Novo Serviço' não aparece"

**Solução**:

- Fazer login primeiro
- Virar prestador (clique no botão da homepage)
- Recarregar página (F5)

---

## 📚 Referências

- [Express.js Docs](https://expressjs.com/pt-br/)
- [MySQL 2 Docs](https://github.com/mysqljs/mysql)
- [Bootstrap 5](https://getbootstrap.com/)
- [JWT.io](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcryptjs)

---

## 📄 Licença

MIT License - Use livremente!

---

## 👨‍💻 Autor
Vilander Costa
Desenvolvido como um projeto de aprendizado.\


---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar este README
2. Ver console do navegador (F12)
3. Ver logs do backend (terminal)



