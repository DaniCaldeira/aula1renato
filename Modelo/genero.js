import GeneroDAO from "../Persistencia/generoDAO.js";

export default class Genero {
    #codigo;
    #nome;

    constructor(codigo = 0, nome = "") {
        this.#codigo = codigo;
        this.#nome = nome;
    }

    get codigo() {
        return this.#codigo;
    }
    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }
    set nome(novoNome) {
        this.#nome = novoNome;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
        };
    }

    async gravar() {
        const generoDAO = new GeneroDAO();
        await generoDAO.gravar(this);
    }

    async excluir() {
        const generoDAO = new GeneroDAO();
        await generoDAO.excluir(this);
    }

    async atualizar() {
        const generoDAO = new GeneroDAO();
        await generoDAO.atualizar(this);
    }

    async consultar(termo) {
        const generoDAO = new GeneroDAO();
        return await generoDAO.consultar(termo);
    }

    async vincularLivro(livroCodigo) {
        const generoDAO = new GeneroDAO();
        await generoDAO.vincularLivroGenero(livroCodigo, this.#codigo);
    }

    async desvincularLivro(livroCodigo) {
        const generoDAO = new GeneroDAO();
        await generoDAO.desvincularLivroGenero(livroCodigo, this.#codigo);
    }

    async consultarGenerosPorLivro(livroCodigo) {
        const generoDAO = new GeneroDAO();
        return await generoDAO.consultarGenerosPorLivro(livroCodigo);
    }
}
