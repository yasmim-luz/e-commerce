function addToCart(productName) {
  alert(`Você adicionou "${productName}" ao carrinho!`);
}
// backend/index.js

// backend/index.js

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Supabase config
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET: Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// GET: Produto específico por ID
app.get('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// POST: Adicionar novo produto (admin)
app.post('/api/produtos', async (req, res) => {
  const { nome, descricao, preco, imagem, categoria } = req.body;
  const { data, error } = await supabase.from('products').insert([{ nome, descricao, preco, imagem, categoria }]);
  if (error) return res.status(500).json({ error });
  res.status(201).json(data);
});

// PUT: Atualizar produto (admin)
app.put('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, imagem, categoria } = req.body;
  const { data, error } = await supabase.from('products').update({ nome, descricao, preco, imagem, categoria }).eq('id', id);
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// DELETE: Remover produto (admin)
app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(500).json({ error });
  res.status(204).end();
});

// GET: Filtrar produtos por categoria
app.get('/api/produtos/categoria/:categoria', async (req, res) => {
  const { categoria } = req.params;
  const { data, error } = await supabase.from('products').select('*').eq('categoria', categoria);
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// GET: Buscar produtos por nome (pesquisa)
app.get('/api/produtos/busca/:termo', async (req, res) => {
  const { termo } = req.params;
  const { data, error } = await supabase.from('products').select('*').ilike('nome', `%${termo}%`);
  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});