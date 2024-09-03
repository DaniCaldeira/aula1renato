import Genero from "../Modelo/genero.js";

export default class GeneroCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;

            // Extraindo os dados do gênero
            const nome = dados.nome;

            // Validando os dados recebidos
            if (!nome) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o nome do gênero!"
                });
            }

            const genero = new Genero(0, nome);

            try {
                await genero.gravar();
                resposta.status(200).json({
                    "status": true,
                    "codigoGerado": genero.codigo,
                    "mensagem": "Gênero incluído com sucesso!"
                });
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao registrar o gênero: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um gênero!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;

            // Extraindo os dados do gênero
            const codigo = dados.codigo;
            const nome = dados.nome;

            // Validando os dados recebidos
            if (!codigo || !nome) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do gênero corretamente!"
                });
            }

            const genero = new Genero(codigo, nome);

            try {
                await genero.atualizar();
                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Gênero atualizado com sucesso!"
                });
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao atualizar o gênero: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um gênero!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const genero = new Genero(codigo);

                try {
                    await genero.excluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Gênero excluído com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o gênero: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do gênero!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um gênero!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === "GET") {
            const genero = new Genero();
            try {
                const listaGeneros = await genero.consultar(termo);
                resposta.json({
                    status: true,
                    listaGeneros
                });
            } catch (erro) {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter os gêneros: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar gêneros!"
            });
        }
    }

    async vincularLivroGenero(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;

            // Extraindo os dados de vinculação
            const livroCodigo = dados.livroCodigo;
            const generoCodigo = dados.generoCodigo;

            // Validando os dados recebidos
            if (!livroCodigo || !generoCodigo) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe os códigos do livro e do gênero!"
                });
            }

            const genero = new Genero(generoCodigo);

            try {
                await genero.vincularLivro(livroCodigo);
                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Livro e gênero vinculados com sucesso!"
                });
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao vincular livro e gênero: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para vincular livro e gênero!"
            });
        }
    }

    async desvincularLivroGenero(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;

            // Extraindo os dados de desvinculação
            const livroCodigo = dados.livroCodigo;
            const generoCodigo = dados.generoCodigo;

            // Validando os dados recebidos
            if (!livroCodigo || !generoCodigo) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe os códigos do livro e do gênero!"
                });
            }

            const genero = new Genero(generoCodigo);

            try {
                await genero.desvincularLivro(livroCodigo);
                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Livro e gênero desvinculados com sucesso!"
                });
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao desvincular livro e gênero: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para desvincular livro e gênero!"
            });
        }
    }
}
