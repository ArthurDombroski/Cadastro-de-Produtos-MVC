const express = require('express');
const router = express.Router();

const { Categoria } = require('../models');

router.get('/', async (req, res) => {
  const categorias = await Categoria.findAll({
    order: [['nome', 'ASC']]
  });

  res.render('categorias/index', {
    categorias
  });
});

router.get('/novo', (req, res) => {
  res.render('categorias/novo');
});

router.post('/', async (req, res) => {
  await Categoria.findOrCreate({
    where: {
      nome: req.body.nome.trim()
    }
  });

  res.redirect('/categorias');
});

module.exports = router;
