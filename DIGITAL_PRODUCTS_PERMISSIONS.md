# Resolvendo "permission denied for table digital_products"

## 1️⃣ Por que o erro acontece?

O **RLS** (Row‑Level Security) da tabela `digital_products` permite apenas usuários com o role **ADMIN** ou o **service role** da API. Quando a ação do servidor (`createDigitalProductAction`, `updateDigitalProductAction` ou `deleteDigitalProductAction`) tenta gravar na tabela sem usar a *service key* ou sem uma sessão de usuário admin, o Supabase devolve:

```
permission denied for table digital_products
```

## 2️⃣ Variáveis de ambiente necessárias

| Nome | Onde deve ser definido | Valor esperado |
|------|------------------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel → **Environment Variables** (Production & Preview) | URL pública do seu projeto Supabase (`https://xxxx.supabase.co`). |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel → **Environment Variables** (Production & Preview) **sem** o prefixo `NEXT_PUBLIC_` | *Service role key* (chave secreta). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel → **Environment Variables** (Production & Preview) | Chave anônima (usada no cliente). |

> **Importante:** O código ***não*** lê `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`. Ele espera a variável **exata** `SUPABASE_SERVICE_ROLE_KEY`. Se você criou a chave apenas como variável pública (`NEXT_PUBLIC_…`), o servidor recebe um `undefined` e continua usando a chave anônima, resultando na negação de permissão.

## 3️⃣ Como garantir que a chave está disponível no servidor

1. Abra o painel da Vercel → *Your Project* → **Settings** → **Environment Variables**.
2. Clique em **Add Variable**.
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** cole a *service role key* que você encontra no Supabase → **Settings** → **API** → **Service role**.
   - **Environment:** `Production` (e, se usar *Preview Deployments*, selecione `Preview`).
3. Salve e **redeploy** o projeto (ou faça um push simples para disparar um novo build).

### Local development
Crie (ou atualize) o arquivo `\.env.local` na raiz do projeto:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Reinicie o servidor de desenvolvimento (`npm run dev`).

## 4️⃣ Verificando o role do usuário

A política de admin verifica:
```sql
EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
```
Certifique‑se de que o usuário que está logado tem `role = 'ADMIN'` na tabela `profiles`.

- No Supabase Dashboard → **Table Editor** → `profiles` → procure seu `id` (UID) e confirme a coluna `role`.
- Caso o usuário ainda não seja admin, você pode atualizar via SQL:
  ```sql
  UPDATE profiles SET role = 'ADMIN' WHERE id = 'SEU_UID';
  ```

## 5️⃣ Fluxo de validação (passo a passo)

1. **Login** como usuário admin no site (ou defina o cookie `admin_bypass=true` temporariamente).  
2. Ao submeter o formulário de criação/edição, a Server Action chama `checkAdmin()` → se o usuário for admin, a função devolve um cliente **service role**.
3. Operação (`insert`, `update`, `delete`) ocorre com permissões totais e não deve gerar `permission denied`.

## 6️⃣ Depuração rápida

```js
// Dentro de qualquer ação, adicione temporariamente:
console.log('UID:', (await supabase.auth.getUser()).data.user?.id);
```
Verifique o log no console do Vercel (ou no terminal local) para confirmar que o UID está presente.

Se ainda receber `permission denied`, verifique:
- A variável `SUPABASE_SERVICE_ROLE_KEY` está vazia? (log `process.env.SUPABASE_SERVICE_ROLE_KEY`).
- O cliente está realmente usando a *service key* (cheque o `supabase` URL nas requisições de rede).  
- A política “Admin can manage digital products” está ativa (confira no SQL `SELECT * FROM pg_policy WHERE tablename = 'digital_products';`).

## 7️⃣ Resumo rápido de ações a realizar

- **Adicionar** a variável de ambiente **SUPABASE_SERVICE_ROLE_KEY** (sem `NEXT_PUBLIC_`).
- **Re‑deploy** o projeto.
- **Garantir** que o usuário autenticado tem `role = 'ADMIN'`.
- **Testar** a criação/edição de produto novamente.

Com esses passos a mensagem *permission denied for table digital_products* deve desaparecer e o painel de produtos funcionará normalmente.
