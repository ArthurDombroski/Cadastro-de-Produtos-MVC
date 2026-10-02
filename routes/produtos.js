const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
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

// Lista os produtos; com ?busca=termo filtra pelo nome (LIKE %termo%)
router.get('/', async (req, res) => {
  const busca = (req.query.busca || '').trim();
  const where = {};

  if (busca) {
    where.nome = {
      [Op.like]: `%${busca}%`
    };
  }

  const produtos = await Produto.findAll({
    where,
    include: {
      model: Categoria,
      as: 'categoria'
    }
  });

  res.render('produtos/index', {
    produtos,
    busca
  });
});

router.get('/novo', async (req, res) => {
  const categorias = await listarCategorias();

  res.render('produtos/novo', {
    categorias
  });
});

// Desafio 2: lista somente os produtos da categoria informada na URL
router.get('/categoria/:categoriaId', async (req, res, next) => {
  const categoria = await Categoria.findByPk(req.params.categoriaId);

  if (!categoria) {
    return next();
  }

  const produtos = await Produto.findAll({
    where: {
      categoriaId: categoria.id
    },
    order: [['nome', 'ASC']]
  });

  res.render('produtos/categoria', {
    categoria,
    produtos
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
