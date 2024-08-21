import { Router } from "express";
import AutorCtrl from "../Controle/autorCtrl.js";

//rotas é o mapeamento das requisições da web para um determinado
//endpoint da aplicação

const autorCtrl = new AutorCtrl();
const rotaAutor = new Router();

rotaAutor
    .get('/', autorCtrl.consultar)
    .get('/:termo', autorCtrl.consultar)
    .post('/', autorCtrl.gravar)
    .patch('/', autorCtrl.atualizar)
    .put('/', autorCtrl.atualizar)
    .delete('/', autorCtrl.excluir);

export default rotaAutor;
