import express from 'express';
import cors from 'cors';
import rotaCategoria from './Rotas/rotaCategoria.js';
import rotaProduto from './Rotas/rotaProduto.js';
import rotaLivro from './Rotas/rotaLivro.js';
import rotaAutor from './Rotas/rotaAutor.js';
import session from 'express-session';
import dotenv from 'dotenv';
import rotaAutenticacao from './Rotas/rotaAutenticacao.js';

dotenv.config();

console.log("CHAVE_SECRETA:", process.env.CHAVE_SECRETA);

if (!process.env.CHAVE_SECRETA) {
    throw new Error('CHAVE_SECRETA não definida. Verifique o arquivo .env.');
}

const host='0.0.0.0';
const porta=3000;

const app = express();

app.use(session({
    secret: process.env.CHAVE_SECRETA,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 15 }
}))

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/categoria',rotaCategoria);
app.use('/produto',rotaProduto);
app.use('/livro', rotaLivro);
app.use('/autor', rotaAutor);
app.use('/autenticacao', rotaAutenticacao);

app.listen(porta, host, ()=>{
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
})
