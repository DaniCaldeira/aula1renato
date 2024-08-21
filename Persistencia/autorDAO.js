import Autor from "../Modelo/autor.js";
import conectar from "./conexao.js";

export default class AutorDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); // Retorna uma conexão
            const sql = `
                CREATE TABLE IF NOT EXISTS autor(
                    aut_codigo INT NOT NULL AUTO_INCREMENT,
                    aut_nome VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_autor PRIMARY KEY(aut_codigo)
                );`;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(autor) {
        if (autor instanceof Autor) {
            const sql = "INSERT INTO autor(aut_nome) VALUES(?)";
            const parametros = [autor.nome];
            const conexao = await conectar(); // Retorna uma conexão
            const retorno = await conexao.execute(sql, parametros); // Prepara a SQL e depois executa
            autor.codigo = retorno[0].insertId;
            await conexao.release(); // Substituindo global.poolConexoes.releaseConnection(conexao)
        }
    }

    async atualizar(autor) {
        if (autor instanceof Autor) {
            const sql = "UPDATE autor SET aut_nome = ? WHERE aut_codigo = ?";
            const parametros = [autor.nome, autor.codigo];
            const conexao = await conectar(); // Retorna uma conexão
            await conexao.execute(sql, parametros); // Prepara a SQL e depois executa
            await conexao.release(); // Substituindo global.poolConexoes.releaseConnection(conexao)
        }
    }

    async excluir(autor) {
        if (autor instanceof Autor) {
            const sql = "DELETE FROM autor WHERE aut_codigo = ?";
            const parametros = [autor.codigo];
            const conexao = await conectar(); // Retorna uma conexão
            await conexao.execute(sql, parametros); // Prepara a SQL e depois executa
            await conexao.release(); // Substituindo global.poolConexoes.releaseConnection(conexao)
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        // É um número inteiro?
        if (!isNaN(parseInt(parametroConsulta))) {
            // Consultar pelo código do autor
            sql = 'SELECT * FROM autor WHERE aut_codigo = ? ORDER BY aut_nome';
            parametros = [parametroConsulta];
        } else {
            // Consultar pelo nome
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM autor WHERE aut_nome LIKE ?";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, parametros);
        let listaAutores = [];
        for (const registro of registros) {
            const autor = new Autor(registro.aut_codigo, registro.aut_nome);
            listaAutores.push(autor);
        }
        await conexao.release(); // Substituindo global.poolConexoes.releaseConnection(conexao)
        return listaAutores;
    }
}
