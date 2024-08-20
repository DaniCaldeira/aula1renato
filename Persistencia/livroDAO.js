import Livro from '../Modelo/livro.js';
import conectar from './conexao.js';

export default class LivroDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); // Retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS livro (
                livro_codigo INT NOT NULL AUTO_INCREMENT,
                livro_titulo VARCHAR(255) NOT NULL,
                livro_autor VARCHAR(255) NOT NULL,
                livro_editora VARCHAR(255) NOT NULL,
                livro_ano_publicacao INT NOT NULL,
                livro_preco_custo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                livro_preco_venda DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                livro_quantidade_estoque DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                CONSTRAINT pk_livro PRIMARY KEY (livro_codigo)
            )
        `;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(livro) {
        if (livro instanceof Livro) {
            const sql = `INSERT INTO livro(livro_titulo, livro_autor, livro_editora, 
                livro_ano_publicacao, livro_preco_custo, livro_preco_venda, livro_quantidade_estoque)
                VALUES(?,?,?,?,?,?,?)`;
            const parametros = [livro.titulo, livro.autor, livro.editora,
                                livro.anoPublicacao, livro.precoCusto, livro.precoVenda,
                                livro.quantidadeEstoque];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            livro.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(livro) {
        if (livro instanceof Livro) {
            const sql = `UPDATE livro SET livro_titulo = ?, livro_autor = ?, livro_editora = ?,
                livro_ano_publicacao = ?, livro_preco_custo = ?, livro_preco_venda = ?, 
                livro_quantidade_estoque = ? WHERE livro_codigo = ?`;
            const parametros = [livro.titulo, livro.autor, livro.editora, 
                                livro.anoPublicacao, livro.precoCusto, livro.precoVenda, 
                                livro.quantidadeEstoque, livro.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(livro) {
        if (livro instanceof Livro) {
            const sql = `DELETE FROM livro WHERE livro_codigo = ?`;
            const parametros = [livro.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        if (!termo) {
            termo = "";
        }
        const conexao = await conectar();
        let listaLivros = [];
        if (!isNaN(parseInt(termo))) {
            // Consulta pelo código do livro
            const sql = `SELECT l.livro_codigo, l.livro_titulo, l.livro_autor, l.livro_editora,
                         l.livro_ano_publicacao, l.livro_preco_custo, l.livro_preco_venda,
                         l.livro_quantidade_estoque
                         FROM livro l 
                         WHERE l.livro_codigo = ?
                         ORDER BY l.livro_titulo`;
            const parametros = [termo];
            const [registros] = await conexao.execute(sql, parametros);
            for (const registro of registros) {
                const livro = new Livro(registro.livro_codigo, registro.livro_titulo, 
                                        registro.livro_autor, registro.livro_editora,
                                        registro.livro_ano_publicacao, registro.livro_preco_custo,
                                        registro.livro_preco_venda, registro.livro_quantidade_estoque);
                listaLivros.push(livro);
            }
        } else {
            // Consulta pelo título do livro
            const sql = `SELECT l.livro_codigo, l.livro_titulo, l.livro_autor, l.livro_editora,
                         l.livro_ano_publicacao, l.livro_preco_custo, l.livro_preco_venda,
                         l.livro_quantidade_estoque
                         FROM livro l 
                         WHERE l.livro_titulo LIKE ?
                         ORDER BY l.livro_titulo`;
            const parametros = ['%' + termo + '%'];
            const [registros] = await conexao.execute(sql, parametros);
            for (const registro of registros) {
                const livro = new Livro(registro.livro_codigo, registro.livro_titulo, 
                                        registro.livro_autor, registro.livro_editora,
                                        registro.livro_ano_publicacao, registro.livro_preco_custo,
                                        registro.livro_preco_venda, registro.livro_quantidade_estoque);
                listaLivros.push(livro);
            }
        }

        return listaLivros;
    }
}
