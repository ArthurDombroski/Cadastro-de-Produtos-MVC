const express = require('express');
const router = express.Router();

const { Produto, Categoria } = require('../models');

// O <select> envia string vazia quando nenhuma categoria é escolhida;
// nesse caso a chave estrangeira deve ser gravada como null.
function dadosDoProduto(body) {
  return {
    nome: body.nome,
    preco: body.preco,
    quantidade: body.quantidade || 0,
    categoriaId: body.categoriaId || null
  };
}

function listarCategorias() {
  return Categoria.findAll({
    order: [['nome', 'ASC']]
  });
}

router.get('/', async (req, res) => {
  const produtos = await Produto.findAll({
    include: {
      model: Categoria,
      as: 'categoria'
    }
  });

  res.render('produtos/index', {
    produtos
  });
});

router.get('/novo', async (req, res) => {
  const categorias = await listarCategorias();

  res.render('produtos/novo', {
    categorias
  });
});

router.post('/', async (req, res) => {
  await Produto.create(dadosDoProduto(req.body));

  res.redirect('/produtos');
});

router.get('/:id/editar', async (req, res, next) => {
  const produto = await Produto.findByPk(req.params.id);

  if (!produto) {
    return next();
  }

  const categorias = await listarCategorias();

  res.render('produtos/editar', {
    produto,
    categorias
  });
});

router.post('/:id', async (req, res) => {
  await Produto.update(dadosDoProduto(req.body), {
    where: {
      id: req.params.id
    }
  });

  res.redirect('/produtos');
});

router.post('/:id/deletar', async (req, res) => {
  await Produto.destroy({
    where: {
      id: req.params.id
    }
  });

  res.redirect('/produtos');
});

module.exports = router;
