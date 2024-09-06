import LivroDAO from "../Persistencia/livroDAO.js";
import Autor from "./autor.js";

export default class Livro {
    #Id
    #codigo;
    #titulo;
    #autor; // Adicione a propriedade para o autor
    #editora;
    #anoPublicacao;
    #precoCusto;
    #precoVenda;
    #quantidadeEstoque;
   
    #codigo_genero

    constructor(codigo = 0, titulo = "", autor = null, editora = "", anoPublicacao = 0, precoCusto = 0, precoVenda = 0, quantidadeEstoque = 0, codigo_genero=0,Id = 0) {
       
        this.#codigo = codigo;
        this.#titulo = titulo;
        this.#autor = autor; // Inicialize a propriedade autor
        this.#editora = editora;
        this.#anoPublicacao = anoPublicacao;
        this.#precoCusto = precoCusto;
        this.#precoVenda = precoVenda;
        this.#quantidadeEstoque = quantidadeEstoque;
        this.#codigo_genero = codigo_genero;
        this.#Id = Id;
    }
    get Id(){
        return this.#Id;
    }
    set Id(novoId){
        this.#Id = novoId;

    }

    get codigo_genero(){
        return this.#codigo_genero;
    }
    set codigo_genero(novoCodigoGenero){
        this.#codigo_genero = novoCodigoGenero;

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
            codigo_genero : this.#codigo_genero,
            id_livro_genero : this.#Id
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
