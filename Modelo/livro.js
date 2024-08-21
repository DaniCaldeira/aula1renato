import LivroDAO from "../Persistencia/livroDAO.js";
import Autor from "./autor.js";

export default class Livro {
    #codigo;
    #titulo;
    #autor; // Adicione a propriedade para o autor
    #editora;
    #anoPublicacao;
    #precoCusto;
    #precoVenda;
    #quantidadeEstoque;

    constructor(codigo = 0, titulo = "", autor = null, editora = "", anoPublicacao = 0, precoCusto = 0, precoVenda = 0, quantidadeEstoque = 0) {
        this.#codigo = codigo;
        this.#titulo = titulo;
        this.#autor = autor; // Inicialize a propriedade autor
        this.#editora = editora;
        this.#anoPublicacao = anoPublicacao;
        this.#precoCusto = precoCusto;
        this.#precoVenda = precoVenda;
        this.#quantidadeEstoque = quantidadeEstoque;
    }

    get codigo() {
        return this.#codigo;
    }
    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get titulo() {
        return this.#titulo;
    }
    set titulo(novoTitulo) {
        this.#titulo = novoTitulo;
    }

    get autor() {
        return this.#autor;
    }
    set autor(novoAutor) {
        if (novoAutor instanceof Autor) {this.#autor = novoAutor;} // Atualize o setter para a propriedade autor
    }

    get editora() {
        return this.#editora;
    }
    set editora(novaEditora) {
        this.#editora = novaEditora;
    }

    get anoPublicacao() {
        return this.#anoPublicacao;
    }
    set anoPublicacao(novoAno) {
        this.#anoPublicacao = novoAno;
    }

    get precoCusto() {
        return this.#precoCusto;
    }
    set precoCusto(novoPrecoCusto) {
        this.#precoCusto = novoPrecoCusto;
    }

    get precoVenda() {
        return this.#precoVenda;
    }
    set precoVenda(novoPrecoVenda) {
        this.#precoVenda = novoPrecoVenda;
    }

    get quantidadeEstoque() {
        return this.#quantidadeEstoque;
    }
    set quantidadeEstoque(novaQuantidade) {
        this.#quantidadeEstoque = novaQuantidade;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            titulo: this.#titulo,
            autor: this.#autor, // Inclua o autor no método toJSON
            editora: this.#editora,
            anoPublicacao: this.#anoPublicacao,
            precoCusto: this.#precoCusto,
            precoVenda: this.#precoVenda,
            quantidadeEstoque: this.#quantidadeEstoque,
        };
    }

    async gravar() {
        const livroDAO = new LivroDAO();
        await livroDAO.gravar(this);
    }

    async excluir() {
        const livroDAO = new LivroDAO();
        await livroDAO.excluir(this);
    }

    async atualizar() {
        const livroDAO = new LivroDAO();
        await livroDAO.atualizar(this);
    }

    async consultar(termo) {
        const livroDAO = new LivroDAO();
        return await livroDAO.consultar(termo);
    }
}
