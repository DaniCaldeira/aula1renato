import Genero from '../Modelo/genero.js';
import conectar from './conexao.js';

export default class GeneroDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
    
            // Criação da tabela genero
            let sql = `
            CREATE TABLE IF NOT EXISTS genero (
                genero_codigo INT NOT NULL AUTO_INCREMENT,
                genero_nome VARCHAR(255) NOT NULL,
                CONSTRAINT pk_genero PRIMARY KEY (genero_codigo)
            );
            `;
            await conexao.execute(sql);
    
            // Criação da tabela livro_genero
            sql = `
            CREATE TABLE IF NOT EXISTS livro_genero (
                livro_codigo INT NOT NULL,
                genero_codigo INT NOT NULL,
                CONSTRAINT fk_livro FOREIGN KEY (livro_codigo) REFERENCES livro(livro_codigo),
                CONSTRAINT fk_genero FOREIGN KEY (genero_codigo) REFERENCES genero(genero_codigo),
                CONSTRAINT pk_livro_genero PRIMARY KEY (livro_codigo, genero_codigo)
            );
            `;
            await conexao.execute(sql);
    
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }
    

    async gravar(genero) {
        if (genero instanceof Genero) {
            const sql = `INSERT INTO genero(genero_nome) VALUES(?)`;
            const parametros = [genero.nome];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            genero.codigo = retorno[0].insertId;
            await conexao.release();
        }
    }

    async atualizar(genero) {
        if (genero instanceof Genero) {
            const sql = `UPDATE genero SET genero_nome = ? WHERE genero_codigo = ?`;
            const parametros = [genero.nome, genero.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async excluir(genero) {
        if (genero instanceof Genero) {
            const sql = `DELETE FROM genero WHERE genero_codigo = ?`;
            const parametros = [genero.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async consultar(termo) {
        if (!termo) {
            termo = "";
        }
        const conexao = await conectar();
        let listaGeneros = [];
        const sql = `SELECT genero_codigo, genero_nome FROM genero WHERE genero_nome LIKE ? ORDER BY genero_nome`;
        const parametros = ['%' + termo + '%'];
        const [registros] = await conexao.execute(sql, parametros);
        for (const registro of registros) {
            const genero = new Genero(registro.genero_codigo, registro.genero_nome);
            listaGeneros.push(genero);
        }
        await conexao.release();
        return listaGeneros;
    }

    async vincularLivroGenero(livroCodigo, generoCodigo) {
        const sql = `INSERT INTO livro_genero(livro_codigo, genero_codigo) VALUES(?, ?)`;
        const parametros = [livroCodigo, generoCodigo];

        const conexao = await conectar();
        await conexao.execute(sql, parametros);
        await conexao.release();
    }

    async desvincularLivroGenero(livroCodigo, generoCodigo) {
        const sql = `DELETE FROM livro_genero WHERE livro_codigo = ? AND genero_codigo = ?`;
        const parametros = [livroCodigo, generoCodigo];

        const conexao = await conectar();
        await conexao.execute(sql, parametros);
        await conexao.release();
    }

    async consultarGenerosPorLivro(livroCodigo) {
        const sql = `
            SELECT g.genero_codigo, g.genero_nome
            FROM genero g
            JOIN livro_genero lg ON g.genero_codigo = lg.genero_codigo
            WHERE lg.livro_codigo = ?`;

        const parametros = [livroCodigo];

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, parametros);
        let listaGeneros = [];
        for (const registro of registros) {
            const genero = new Genero(registro.genero_codigo, registro.genero_nome);
            listaGeneros.push(genero);
        }
        await conexao.release();
        return listaGeneros;
    }
}
