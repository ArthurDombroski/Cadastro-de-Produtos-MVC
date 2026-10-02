# Cadastro de Produtos — MVC

Aplicação web para cadastro de produtos de uma pequena loja, desenvolvida no padrão MVC com Node.js, Express, EJS, Sequelize e SQLite.

## Integrante

- Arthur Dombroski — RM: (preencher)

## Como executar

É necessário ter o [Node.js](https://nodejs.org) instalado.

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor:

```bash
npm start
```

3. Acesse no navegador:

```
http://localhost:3000/produtos
```

O arquivo `database.sqlite` é criado automaticamente na primeira execução (`sequelize.sync()`), por isso ele não é versionado.

## Funcionalidades

- Cadastro de produtos
- Listagem de produtos
- Edição de produtos
- Exclusão de produtos
- Cadastro e listagem de categorias
- Associação de produtos a categorias
- Produtos por categoria
- Pesquisa de produtos por nome

## Rotas

| Método | URL | Ação |
| --- | --- | --- |
| GET | `/produtos` | Lista os produtos (aceita `?busca=termo`) |
| GET | `/produtos/novo` | Formulário de cadastro |
| POST | `/produtos` | Cria um produto |
| GET | `/produtos/:id/editar` | Formulário de edição |
| POST | `/produtos/:id` | Atualiza um produto |
| POST | `/produtos/:id/deletar` | Exclui um produto |
| GET | `/produtos/categoria/:categoriaId` | Lista os produtos de uma categoria |
| GET | `/categorias` | Lista as categorias |
| GET | `/categorias/novo` | Formulário de cadastro de categoria |
| POST | `/categorias` | Cria uma categoria |

## Organização

```
├── app.js                 configuração do Express e registro das rotas
├── bin/www                inicialização do servidor
├── models/
│   └── index.js           conexão, Models Produto e Categoria e associação
├── routes/
│   ├── index.js           redireciona / para /produtos
│   ├── produtos.js        CRUD, produtos por categoria e pesquisa
│   └── categorias.js      listagem e cadastro de categorias
├── views/
│   ├── produtos/          index, novo, editar e categoria
│   └── categorias/        index e novo
└── public/
```

## Desafios

### Desafio 1 — Categorias

Foi criado o Model `Categoria` (`id`, `nome`) em `models/index.js` e um relacionamento 1:N com `Produto`:

```js
Categoria.hasMany(Produto, { foreignKey: 'categoriaId', as: 'produtos' });
Produto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
```

Com isso o Sequelize cria a coluna `categoriaId` na tabela de produtos como chave estrangeira para a tabela de categorias, ou seja, a categoria fica realmente gravada no banco. As categorias são cadastradas em `/categorias/novo`. Os formulários de produto ganharam um `<select>` preenchido com as categorias do banco, e a listagem de produtos usa `include` para trazer a categoria de cada produto e exibir o nome dela em uma nova coluna.

### Desafio 2 — Produtos por categoria

Foi criada a rota `GET /produtos/categoria/:categoriaId`. A categoria é identificada pelo seu `id` na URL (`req.params.categoriaId`). A rota busca a categoria com `findByPk` (retornando 404 se ela não existir) e depois consulta apenas os produtos dela:

```js
Produto.findAll({ where: { categoriaId: categoria.id } });
```

O resultado é exibido na view `views/produtos/categoria.ejs`. A categoria pode ser selecionada pelo link "Ver produtos" na página de categorias ou clicando no nome da categoria na listagem de produtos.

### Desafio extra — Pesquisa de produtos

A listagem de produtos possui um formulário que envia o termo por `GET /produtos?busca=termo`. Quando o termo é informado, a consulta recebe uma condição com o operador `Op.like` do Sequelize, que gera um `LIKE '%termo%'` no SQL e retorna os produtos cujo nome contém o termo:

```js
where.nome = { [Op.like]: `%${busca}%` };
```
