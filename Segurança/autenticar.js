export default function login(req, resp){

    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if (usuario === 'admin' && senha === 'admin'){

        req.session.usuario = usuario;
        resp.status(200).json({
            status: true,
            mensagem: "Logado com sucesso!"
        });

    }

    else{
        resp.status(401).json(
            {
                status: false,
                mensagem: 'Usuário ou senha inválida!'
            }
        );
    }
}


export function logout(req){
    req.session.destroy();
}