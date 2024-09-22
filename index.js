import express from 'express';
import cors from 'cors';
import rotaCategoria from './Rotas/rotaCategoria.js';
import rotaProduto from './Rotas/rotaProduto.js';
import rotaLivro from './Rotas/rotaLivro.js';
import rotaAutor from './Rotas/rotaAutor.js';
import rotaGenero from './Rotas/rotaGenero.js'; // Importa a rota de gênero
import session from 'express-session';
import dotenv from 'dotenv';
import rotaAutenticacao from './Rotas/rotaAutenticacao.js';
import { verificarAutenticacao } from './Segurança/autenticar.js';

dotenv.config();

console.log("CHAVE_SECRETA:", process.env.CHAVE_SECRETA);

/*if (!process.env.CHAVE_SECRETA) {
    throw new Error('CHAVE_SECRETA não definida. Verifique o arquivo .env.');
}*/

const host='0.0.0.0';
const porta=4000;

const app = express();

app.use(session({
    secret: process.env.CHAVE_SECRETA,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 15 }
}))

app.use(cors({
    origin: 'http://localhost:3000', // Adicione a URL do seu frontend
    credentials: true // Permite o envio de cookies entre domínios
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/categoria', verificarAutenticacao, rotaCategoria);
app.use('/produto', verificarAutenticacao, rotaProduto);
app.use('/livro', verificarAutenticacao, rotaLivro);
app.use('/autor', verificarAutenticacao, rotaAutor);
app.use('/genero', verificarAutenticacao, rotaGenero); // Adiciona a rota de gênero
app.use('/autenticacao', rotaAutenticacao);

app.listen(porta, host, ()=>{
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
})
