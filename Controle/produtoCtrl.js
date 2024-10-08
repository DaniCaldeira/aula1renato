import Produto from "../Modelo/produto.js";

export default class ProdutoCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            
            // Extraindo os dados do produto
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

                const produto = new Produto(0, titulo, autor, editora, anoPublicacao, precoCusto, precoVenda, quantidadeEstoque);
                
                // Resolvendo a promise
                produto.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": produto.codigo,
                        "mensagem": "Produto incluído com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o produto: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do produto corretamente!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um produto!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            
            // Extraindo os dados do produto
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

                const produto = new Produto(codigo, titulo, autor, editora, anoPublicacao, 
                                        precoCusto, precoVenda, quantidadeEstoque);
                
                // Resolvendo a promise
                produto.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Produto atualizado com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o produto: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do produto corretamente!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um produto!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const produto = new Produto(codigo);
                
                // Resolvendo a promise
                produto.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Produto excluído com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o produto: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do produto!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um produto!"
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === "GET") {
            const produto = new Produto();
            produto.consultar(termo).then((listaProdutos) => {
                resposta.json({
                    status: true,
                    listaProdutos
                });
            })
            .catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter os produtos: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar produtos!"
            });
        }
    }
}
