# 📦 Sistema de Gestão de Estoque - Backend

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js para aplicações server-side
- **TypeORM** - ORM para TypeScript e JavaScript
- **PostgreSQL** - Banco de dados relacional (via Supabase)
- **Class Validator** - Validação de dados
- **Class Transformer** - Transformação de objetos

## 📁 Estrutura do Projeto

```
src/
├── entities/           # Entidades do banco de dados
│   ├── product.entity.ts
│   ├── movement.entity.ts
│   └── index.ts
├── products/           # Módulo de produtos
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── movements/          # Módulo de movimentações
│   ├── dto/
│   │   ├── create-movement.dto.ts
│   │   └── update-movement.dto.ts
│   ├── movements.controller.ts
│   ├── movements.service.ts
│   └── movements.module.ts
├── app.module.ts       # Módulo principal
└── main.ts            # Arquivo de entrada
```

## 🔧 Configuração do Ambiente

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados (Supabase)

1. Acesse [Supabase](https://supabase.com/) e crie uma conta
2. Crie um novo projeto
3. Vá para **Settings** → **Database**
4. Copie a **Connection String** do PostgreSQL

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:

```env
# Configurações do Banco de Dados (Supabase)
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres

# Configurações da Aplicação
NODE_ENV=development
PORT=3000

# Configurações do JWT (para futuro uso)
JWT_SECRET=your-super-secret-jwt-key-here

# Configurações do Supabase
SUPABASE_URL=https://[SEU-PROJETO].supabase.co
SUPABASE_ANON_KEY=[SUA-CHAVE-ANONIMA]
```

## 🗄️ Estrutura do Banco de Dados

### Entidade Product

```typescript
{
  id: string (UUID)
  name: string
  description?: string
  sku: string (único)
  price: number
  stockQuantity: number
  minimumStock: number
  category?: string
  unit?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Entidade Movement

```typescript
{
  id: string (UUID)
  type: 'IN' | 'OUT'
  quantity: number
  unitPrice?: number
  description?: string
  reference?: string
  createdAt: Date
  productId: string
}
```

## 🚀 Executando a Aplicação

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

## 📖 API Endpoints

### Produtos

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | `/api/products` | Listar todos os produtos |
| GET | `/api/products?category=categoria` | Listar por categoria |
| GET | `/api/products/low-stock` | Produtos com estoque baixo |
| GET | `/api/products/:id` | Buscar produto por ID |
| POST | `/api/products` | Criar produto |
| PATCH | `/api/products/:id` | Atualizar produto |
| DELETE | `/api/products/:id` | Excluir produto |

### Movimentações

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | `/api/movements` | Listar todas as movimentações |
| GET | `/api/movements?type=IN` | Listar por tipo |
| GET | `/api/movements?productId=uuid` | Listar por produto |
| GET | `/api/movements/summary` | Resumo das movimentações |
| GET | `/api/movements/:id` | Buscar movimentação por ID |
| POST | `/api/movements` | Criar movimentação |
| PATCH | `/api/movements/:id` | Atualizar movimentação |
| DELETE | `/api/movements/:id` | Excluir movimentação |

## 📝 Exemplos de Uso

### Criar um Produto

```json
POST /api/products
{
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "sku": "PROD-001",
  "price": 29.99,
  "stockQuantity": 100,
  "minimumStock": 10,
  "category": "Eletrônicos",
  "unit": "un",
  "isActive": true
}
```

### Criar uma Movimentação de Entrada

```json
POST /api/movements
{
  "type": "IN",
  "quantity": 50,
  "unitPrice": 25.00,
  "description": "Compra de mercadoria",
  "reference": "NF-12345",
  "productId": "uuid-do-produto"
}
```

### Criar uma Movimentação de Saída

```json
POST /api/movements
{
  "type": "OUT",
  "quantity": 10,
  "unitPrice": 29.99,
  "description": "Venda",
  "reference": "VENDA-001",
  "productId": "uuid-do-produto"
}
```

## 🔒 Funcionalidades Implementadas

### Controle de Estoque com Transações

- ✅ **Movimentações Atômicas**: Usa transações do banco para garantir consistência
- ✅ **Validação de Estoque**: Impede saídas que deixariam o estoque negativo
- ✅ **Reversão Automática**: Ao excluir movimentações, o estoque é ajustado automaticamente
- ✅ **Validação de Dados**: DTOs com validação completa usando class-validator

### Recursos Avançados

- ✅ **Estoque Baixo**: Endpoint para identificar produtos com estoque abaixo do mínimo
- ✅ **Filtros**: Busca por categoria, tipo de movimentação e produto
- ✅ **Resumos**: Relatórios de movimentações com totalizadores
- ✅ **CORS**: Configurado para integração com frontend
- ✅ **Validação Global**: Pipes configurados para validação automática

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Testes
npm run test
npm run test:watch
npm run test:cov

# Linting
npm run lint
npm run format
```

## 🔗 Próximos Passos

1. **Configurar credenciais do Supabase** no arquivo `.env`
2. **Testar endpoints** usando Postman ou similar
3. **Integrar com o frontend** React/Vite
4. **Implementar autenticação JWT** (opcional)
5. **Adicionar testes unitários** e de integração

---

🎯 **Backend da Fase 2 concluído com sucesso!** 

O sistema está pronto para uso e integração com o frontend.