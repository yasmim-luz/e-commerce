create table products (
  id uuid default uuid_generate_v4() primary key,
  nome text,
  descricao text,
  preco numeric,
  imagem text,
  categoria text
);
