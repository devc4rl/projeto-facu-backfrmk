// Importa o módulo do Express
const express = require('express');
const app = express();
const port = 8000;

// Importa o módulo do MySQL
const mysql = require('mysql');

// Middleware para processar dados do formulário (URL-encoded)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '88099512', // Sua senha do root
    database: 'projeto_backend'
});

// Conecta ao banco de dados MySQL
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão ao banco de dados MySQL estabelecida com sucesso!');
});

// Rotas para as páginas HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/Home.html');
});

app.get('/sobre', (req, res) => {
    res.sendFile(__dirname + '/public/sobre.html');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/public/Cadastro.html');
});

app.get('/acao', (req, res) => {
    res.sendFile(__dirname + '/public/Ação.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/Login.html');
});

app.get('/relatos', (req, res) => {
    res.sendFile(__dirname + '/public/Relatos.html');
});

// Rota para o cadastro de usuários
app.post('/cadastrar-usuario', (req, res) => {
    const { nome, email, senha } = req.body;

    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    connection.query(query, [nome, email, senha], (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).send('Erro ao cadastrar usuário.');
            return;
        }
        console.log('Usuário cadastrado com sucesso!');
        res.send('Usuário cadastrado com sucesso!');
    });
});

// Rota para o login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(query, [email], (error, results) => {
        if (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).send('Erro ao fazer login.');
            return;
        }

        if (results.length > 0) {
            const usuario = results[0];
            if (senha === usuario.senha) {
                console.log('Login bem-sucedido para:', email);
                res.send('Login bem-sucedido!');
            } else {
                console.log('Senha incorreta para:', email);
                res.status(401).send('Senha incorreta.');
            }
        } else {
            console.log('Usuário não encontrado:', email);
            res.status(404).send('Usuário não encontrado.');
        }
    });
});

// Rota para cadastrar ação climática
app.post('/cadastrar-acao', (req, res) => {
    const { nome, valor, descricao, fornecedor, email, telefone } = req.body;

    const query = 'INSERT INTO acoes (nome, valor, descricao, fornecedor, email_fundador, telefone_fundador) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [nome, valor, descricao, fornecedor, email, telefone], (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar ação:', error);
            res.status(500).send('Erro ao cadastrar ação.');
            return;
        }
        console.log('Ação cadastrada com sucesso!');
        res.send('Ação cadastrada com sucesso!');
    });
});

// Rota para enviar relato
app.post('/enviar-relato', (req, res) => {
    const { descricao, localizacao, gravidade } = req.body;

    if (!descricao || !localizacao || !gravidade) {
        console.error('Erro: Descrição, localização e gravidade são obrigatórios.');
        return res.status(400).send('Por favor, preencha todos os campos obrigatórios.');
    }

    const query = 'INSERT INTO relatos (descricao, localizacao, gravidade) VALUES (?, ?, ?)';
    connection.query(query, [descricao, localizacao, gravidade], (error, results) => {
        if (error) {
            console.error('Erro ao enviar relato:', error);
            return res.status(500).send('Erro ao salvar o relato no banco de dados.');
        }
        console.log('Relato enviado e salvo com sucesso!');
        res.send('Relato enviado e salvo com sucesso!');
    });
});

// 
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});
app.get('/admin/acoes-data', (req, res) => {
    const query = 'SELECT id, nome, descricao, valor FROM acoes';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao buscar ações para admin:', error);
            return res.status(500).json({ error: 'Erro ao buscar ações.' });
        }
        res.json(results);
    });
});

app.delete('/admin/excluir-acao/:id', (req, res) => {
    const acaoId = req.params.id;

    if (!acaoId) {
        return res.status(400).send('ID da ação inválido.');
    }

    const query = 'DELETE FROM acoes WHERE id = ?';
    connection.query(query, [acaoId], (error, results) => {
        if (error) {
            console.error('Erro ao excluir ação:', error);
            return res.status(500).send('Erro ao excluir a ação do banco de dados.');
        }

        if (results.affectedRows > 0) {
            console.log(`Ação com ID ${acaoId} excluída com sucesso.`);
            res.send('Ação excluída com sucesso.');
        } else {
            res.status(404).send('Ação não encontrada.');
        }
    });
});
// 
// 

// 

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});