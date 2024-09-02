import Produto from '../Modelo/produto.js';
import conectar from './conexao.js';

export default class ProdutoDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); // Retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS produto (
                prod_codigo INT NOT NULL AUTO_INCREMENT,
                prod_titulo VARCHAR(255) NOT NULL,
                prod_autor VARCHAR(255) NOT NULL,
                prod_editora VARCHAR(255) NOT NULL,
                prod_ano_publicacao INT NOT NULL,
                prod_preco_custo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                prod_preco_venda DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                prod_quantidade_estoque DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                CONSTRAINT pk_produto PRIMARY KEY (prod_codigo)
            )
        `;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(produto) {
        if (produto instanceof Produto) {
            const sql = `
            INSERT INTO produto(
                prod_titulo, 
                prod_autor, 
                prod_editora, 
                prod_ano_publicacao, 
                prod_preco_custo, 
                prod_preco_venda, 
                prod_quantidade_estoque
                )
                VALUES(
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                    )`;
            const parametros = [produto.titulo, produto.autor, produto.editora,
                                produto.anoPublicacao, produto.precoCusto, produto.precoVenda,
                                produto.quantidadeEstoque];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            produto.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(produto) {
        if (produto instanceof Produto) {
            const sql = `UPDATE produto SET prod_titulo = ?, prod_autor = ?, prod_editora = ?,
                prod_ano_publicacao = ?, prod_preco_custo = ?, prod_preco_venda = ?, 
                prod_quantidade_estoque = ? WHERE prod_codigo = ?`;
            const parametros = [produto.titulo, produto.autor, produto.editora, 
                                produto.anoPublicacao, produto.precoCusto, produto.precoVenda, 
                                produto.quantidadeEstoque, produto.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(produto) {
        if (produto instanceof Produto) {
            const sql = `DELETE FROM produto WHERE prod_codigo = ?`;
            const parametros = [produto.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        if (!termo) {
            termo = "";
        }
        // termo é um número
        const conexao = await conectar();
        let listaProdutos = [];
        if (!isNaN(parseInt(termo))) {
            // Consulta pelo código do produto
            const sql = `SELECT p.prod_codigo, p.prod_titulo, p.prod_autor, p.prod_editora,
                         p.prod_ano_publicacao, p.prod_preco_custo, p.prod_preco_venda,
                         p.prod_quantidade_estoque
                         FROM produto p 
                         WHERE p.prod_codigo = ?
                         ORDER BY p.prod_titulo`;
            const parametros = [termo];
            const [registros] = await conexao.execute(sql, parametros);
            for (const registro of registros) {
                const produto = new Produto(registro.prod_codigo, registro.prod_titulo, 
                                            registro.prod_autor, registro.prod_editora,
                                            registro.prod_ano_publicacao, registro.prod_preco_custo,
                                            registro.prod_preco_venda, registro.prod_quantidade_estoque);
                listaProdutos.push(produto);
            }
        } else {
            // Consulta pela descrição do produto (ou título)
            const sql = `SELECT p.prod_codigo, p.prod_titulo, p.prod_autor, p.prod_editora,
                         p.prod_ano_publicacao, p.prod_preco_custo, p.prod_preco_venda,
                         p.prod_quantidade_estoque
                         FROM produto p 
                         WHERE p.prod_titulo LIKE ?
                         ORDER BY p.prod_titulo`;
            const parametros = ['%' + termo + '%'];
            const [registros] = await conexao.execute(sql, parametros);
            for (const registro of registros) {
                const produto = new Produto(registro.prod_codigo, registro.prod_titulo, 
                                            registro.prod_autor, registro.prod_editora,
                                            registro.prod_ano_publicacao, registro.prod_preco_custo,
                                            registro.prod_preco_venda, registro.prod_quantidade_estoque);
                listaProdutos.push(produto);
            }
        }

        return listaProdutos;
    }
}
