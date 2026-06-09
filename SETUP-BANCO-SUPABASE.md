# Setup Completo do Supabase

## 1. Rodar a Migration SQL

1. Abra o **SQL Editor** no painel do Supabase
2. Cole todo o conteúdo do arquivo `adicionaressenovo.sql`
3. Execute (atalho: `Ctrl + Enter`)
4. ⚠️ Se der erro de "policy já existe", execute novamente — o SQL agora tem `DROP IF EXISTS`

## 2. Criar os Buckets de Storage

No menu **Storage** do Supabase, crie **4 buckets**:

### Bucket: `media`
| Configuração | Valor |
|---|---|
| Nome | `media` |
| Público? | ✅ **SIM** (Public bucket) |
| Tamanho máximo | `10 MB` |
| Tipos permitidos | `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `application/pdf`, `video/mp4` |

> **Uso:** Upload de imagens e arquivos pelo admin (galeria, banners, etc.)

### Bucket: `avatars`
| Configuração | Valor |
|---|---|
| Nome | `avatars` |
| Público? | ✅ **SIM** (Public bucket) |
| Tamanho máximo | `5 MB` |
| Tipos permitidos | `image/jpeg`, `image/png`, `image/webp` |

> **Uso:** Fotos de perfil dos alunos (enviadas pelo dashboard)

### Bucket: `products`
| Configuração | Valor |
|---|---|
| Nome | `products` |
| Público? | ✅ **SIM** (Public bucket) |
| Tamanho máximo | `100 MB` |
| Tipos permitidos | `application/pdf` |

> **Uso:** PDFs de produtos digitais vendidos na plataforma

### Bucket: `pdfs`
| Configuração | Valor |
|---|---|
| Nome | `pdfs` |
| Público? | ✅ **SIM** (Public bucket) |
| Tamanho máximo | `100 MB` |
| Tipos permitidos | `application/pdf` |

> **Uso:** (Opcional) Material didático anexado às aulas

## 3. Verificar Autenticação

No menu **Authentication → Settings**:
- **EMAIL CONFIRMATION**: desative se quiser que os usuários entrem sem confirmar email (recomendado para desenvolvimento)
- **SECURITY → Update Password**: mantenha ativo

## 4. Estrutura do Projeto

```
/
├── adicionaressenovo.sql          ← Migration principal (rode no Supabase)
├── actions/
│   ├── auth.ts                    ← Login, cadastro, Google OAuth
│   ├── profile.ts                 ← Editar perfil, upload avatar, alterar senha
│   ├── site-content.ts            ← CRUD do conteúdo do site (admin)
│   ├── digital-products.ts        ← CRUD de produtos digitais (admin)
│   ├── upload.ts                  ← Upload de arquivos (admin)
│   ├── stripe.ts                  ← Criar sessão de checkout Stripe
│   ├── courses.ts                 ← CRUD de cursos (admin)
│   └── admin-users.ts             ← Gerenciar usuários (admin)
│
├── app/
│   ├── dashboard/                 ← Portal do Aluno
│   │   ├── page.tsx               ← Meus Cursos (cursos comprados)
│   │   ├── profile/page.tsx       ← Meu Perfil (editar dados)
│   │   ├── history/page.tsx       ← Histórico de compras
│   │   ├── downloads/             ← Produtos digitais comprados
│   │   └── cursos/[slug]/         ← Player de curso
│   │
│   ├── admin/
│   │   ├── page.tsx               ← Dashboard admin (métricas)
│   │   ├── configuracao/          ← Controle total do site (12 abas)
│   │   ├── cursos/                ← CRUD de cursos
│   │   ├── usuarios/              ← CRUD de usuários
│   │   ├── produtos/              ← CRUD de produtos digitais
│   │   └── midias/                ← Biblioteca de mídia
│   │
│   └── cursos/page.tsx            ← Página pública de cursos
│
├── lib/
│   ├── site-content.ts            ← Função que busca conteúdo do site
│   ├── supabase/server.ts         ← Cliente Supabase (server)
│   └── supabase/client.ts         ← Cliente Supabase (browser)
│
└── components/landing/            ← Componentes da página inicial
```

## 5. Fluxo Completo da Plataforma

### Aluno
1. **Cadastro** → `register` → cria conta (nome, email, senha)
2. **Onboarding** → `onboarding` → preenche CPF, telefone, endereço
3. **Dashboard** → vê cursos comprados, perfil, histórico
4. **Comprar curso** → Stripe (cartão, boleto, PIX) → acesso liberado
5. **Comprar PDF** → Stripe → aparece em "Meus Downloads"
6. **Perfil** → pode editar nome, telefone, endereço, foto de avatar

### Admin
1. **Login admin** → `admin@admin.com` / `admin123`
2. **Configurações** → controla TODO o conteúdo do site (12 abas)
3. **Cursos** → criar/editar cursos com módulos e aulas
4. **Produtos Digitais** → criar PDFs para vender (com opção de mostrar na homepage)
5. **Usuários** → ver, editar, bloquear, mudar papel (admin/aluno)
6. **Mídias** → upload de imagens para usar no site

## 6. Variáveis de Ambiente (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...
```

## 7. Comandos

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm start            # Rodar produção
```
