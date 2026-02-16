# 📦 Sistema de Gestão de Estoque

**Acesse o projeto (deploy):** https://gestao-estoque-app-frontend.vercel.app/

## Sobre o projeto

O projeto **Sistema de Gestão de Estoque** é um projeto acadêmico desenvolvido no **Centro Universitário Internacional UNINTER (Uninter)** para a disciplina **Atividades Extensionistas: II: Tecnologia Aplicada à Inclusão Digital - Projeto**.

O objetivo é disponibilizar uma aplicação web que permita **gerenciar produtos** e **controlar movimentações de estoque** (entradas e saídas), facilitando o acompanhamento de quantidades e a identificação de itens com **estoque baixo**.

A aplicação permite:

- Cadastrar, listar, consultar, atualizar e remover produtos
- Registrar movimentações de **entrada** e **saída** vinculadas aos produtos
- Identificar produtos com estoque abaixo do mínimo
- Consultar resumos e listagens com filtros (por categoria, tipo e produto)

O foco do projeto é aplicar conceitos de desenvolvimento **full-stack**, incluindo API REST, validação de dados, persistência em banco relacional e construção de interface web com boa experiência de uso.

**Estrutura do repositório (monorepo):**

- `frontend/`: interface web (React + Vite)
- `backend/`: API REST (NestJS)

## Tecnologias utilizadas

- **Node.js** (ambiente de execução)
- **TypeScript**
- **Backend:** NestJS, TypeORM, PostgreSQL (ex.: Supabase), class-validator
- **Frontend:** React, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/ui, Radix UI, Axios
- **Qualidade:** ESLint e Prettier

## Como executar

### Pré-requisitos

- **Node.js (LTS)** e **npm** (ou Yarn)
- Um banco **PostgreSQL** (local) ou **Supabase**

### 1) Backend (API)

1. Configure as variáveis de ambiente:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   ```

   Edite `backend/.env` e preencha, principalmente, `DATABASE_URL`.

2. Instale e execute:

   ```powershell
   cd backend
   npm install
   npm run start:dev
   ```

A API ficará disponível em `http://localhost:3000/api`.

### 2) Frontend (Web)

1. Configure as variáveis de ambiente:

   ```powershell
   Copy-Item frontend/.env.example frontend/.env
   ```

   Edite `frontend/.env` e defina:
   - `VITE_API_URL=http://localhost:3000/api`

2. Instale e execute:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

A aplicação web ficará disponível, por padrão, em `http://localhost:5173`.
