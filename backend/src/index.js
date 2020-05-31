// Criando uma variável para importar o express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

// Setar um endereço para acessar e ver uma resposta do server
const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-mma0z.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

// use() Vai ser válido para todas as rotas; Fez com que o express entenda requisições com o corpo JSON.
app.use(cors());
app.use(express.json());
app.use(routes)

// get = quando acessar essa rota
// request = requisição e response = resposta
// Essa arrowFunction recebe dois parâmetros que já estão embutidos pelo express. Eles são sempre fixos.
// Requisição eh tudo que o frontend envia pra gente. Em uma requisição serão entregue dados.
// Response eh como a gente vai delvolver uma resposta para o cliente.

// Metodos HTTP: GET, POST, PUT, DELETE

// Tipos de parâmetros:

// Query Params: Visíveis na url. Ex: http://localhost:3333/users?search=Joel;
//      request.query (Filtros, ordenação, paginação, ...)
// Route Params: request.params (Identificar um recurso na alteração ou remoçao)
// Body: request.body (Dados para criação ou alteração de um registo)

// Setar uma porta para a nossa rota do servidor
server.listen(3333);