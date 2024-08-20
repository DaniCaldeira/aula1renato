import Livro from "../Modelo/livro.js";

export default class LivroCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            
            // Extraindo os dados do livro
            const titulo = dados.titulo;
            const autor = dados.autor;
            const editora = dados.editora;
            const anoPublicacao = dados.ano_publicacao;
            const precoCusto = dados.preco_custo;
            const precoVenda = dados.preco_venda;
            const quantidadeEstoque = dados.quantidade_estoque;

            // Validando os dados recebidos
            if (titulo && autor && editora && anoPublicacao > 0 && precoCusto > 0 
                && precoVenda > 0 && quantidadeEstoque >= 0) {

                const livro = new Livro(0, titulo, autor, editora, anoPublicacao, precoCusto, precoVenda, quantidadeEstoque);
                
                // Resolvendo a promise
                livro.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": livro.codigo,
                        "mensagem": "Livro incluído com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o livro: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do livro corretamente!" + anoPublicacao
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um livro!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            
            // Extraindo os dados do livro
            const codigo = dados.codigo;
            const titulo = dados.titulo;
            const autor = dados.autor;
            const editora = dados.editora;
            const anoPublicacao = dados.ano_publicacao;
            const precoCusto = dados.preco_custo;
            const precoVenda = dados.preco_venda;
            const quantidadeEstoque = dados.quantidade_estoque;

            // Validando os dados recebidos
            if (codigo && titulo && autor && editora && anoPublicacao > 0 && precoCusto > 0 
                && precoVenda > 0 && quantidadeEstoque >= 0) {

                const livro = new Livro(codigo, titulo, autor, editora, anoPublicacao, 
                                        precoCusto, precoVenda, quantidadeEstoque);
                
                // Resolvendo a promise
                livro.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Livro atualizado com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o livro: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do livro corretamente!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um livro!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const livro = new Livro(codigo);
                
                // Resolvendo a promise
                livro.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Livro excluído com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o livro: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do livro!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um livro!"
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === "GET") {
            const livro = new Livro();
            livro.consultar(termo).then((listaLivros) => {
                resposta.json({
                    status: true,
                    listaLivros
                });
            })
            .catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter os livros: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar livros!"
            });
        }
    }
}
