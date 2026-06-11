# Como corrigir o erro 500 ao criar/editar/excluir produtos digitais

## Problema original
Quando a ação de **criar**, **atualizar** ou **excluir** um produto digital falhava, o código lançava a exceção (`throw error`).
No Next.js, exceções em **Server Actions** retornam uma resposta HTTP **500**, e em produção a mensagem de erro detalhada é ocultada, resultando na mensagem genérica:
```
Ocorreu um erro na renderização dos componentes do servidor.
```
Isso impedia que o usuário visualizasse o motivo da falha (ex.: permissões, validação, erro do Supabase).

## O que foi alterado
### 1️⃣ `actions/digital-products.ts`
- Removido o `redirect` (a navegação passa a ser feita no cliente).
- As funções **createDigitalProductAction**, **updateDigitalProductAction** e **deleteDigitalProductAction** agora:
  ```ts
  if (error) {
    return { error: error.message } // em vez de throw
  }
  // sucesso
  return { success: true }
  ```
- Mantido `revalidatePath('/admin/produtos')` para invalidar a ISR da lista de produtos.

### 2️⃣ `app/admin/produtos/novo/page.tsx`
- `handleSubmit` foi adaptado para tratar o objeto retornado pelas actions:
  ```ts
  const result = isEditing
    ? await updateDigitalProductAction(formData)
    : await createDigitalProductAction(formData)

  if (result?.error) {
    setError(result.error)
    setSubmitting(false)
    return
  }
  router.push('/admin/produtos')
  ```
- Assim, o erro é exibido na UI (caixa vermelha que já existia), sem gerar um 500.

## Por que ainda pode aparecer o erro 500?
Mesmo após essas mudanças, um **500** pode acontecer se:
- A **chave de serviço** (`SUPABASE_SERVICE_ROLE_KEY`) não estiver disponível no *server‑side*. Ela não deve ter o prefixo `NEXT_PUBLIC_`.
- O usuário não tem a role **ADMIN** e não há o cookie `admin_bypass=true`.
- Algum erro inesperado (por ex., falha de rede) ocorre antes de chegarmos ao `if (error)` acima.

## Verificação das variáveis de ambiente (Vercel)
1. **Acesse o dashboard da Vercel → Settings → Environment Variables**
2. Certifique‑se de que as quatro variáveis abaixo estão definidas **para Production e Preview**:
   | Nome | Valor esperado |
   |------|-----------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase (ex.: `https://xyz.supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (público) |
   | `SUPABASE_SERVICE_ROLE_KEY` | **Service Role Key** – *não* deve ter o prefixo `NEXT_PUBLIC_` |
3. **Não** adicione `NEXT_PUBLIC_` à `SUPABASE_SERVICE_ROLE_KEY`. Ela deve ficar apenas como `SUPABASE_SERVICE_ROLE_KEY` para que o código do servidor a encontre.
4. Salve as alterações e faça um novo deploy.

## Passos para validar localmente
```bash
# 1. Crie um .env.local (não versionado)
cat > .env.local <<EOF
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
EOF

# 2. Rode o projeto
npm run dev   # ou yarn dev
```
- Abra o admin → **Produtos Digitais → Novo Produto**.
- Tente criar, editar e excluir. Se algo falhar, a caixa de erro aparecerá com a mensagem do Supabase (ex.: `Permission denied`).
- Caso ainda receba 500, abra o console do navegador e o terminal para inspecionar logs; você pode estar recebendo um erro antes da verificação de `error` (ex.: usuário não autenticado).

## Checklist rápido
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está definida apenas como variável de servidor.
- [ ] As funções de ação retornam `{ error: … }` ou `{ success: true }`.
- [ ] `handleSubmit` no formulário verifica `result?.error`.
- [ ] Deploy no Vercel com as variáveis atualizadas.
- [ ] Testes manuais confirmam que a UI exibe mensagens de erro ao invés de falhar com 500.

## Onde encontrar o código alterado
- **actions/digital-products.ts** – todas as actions.
- **app/admin/produtos/novo/page.tsx** – tratamento de `handleSubmit`.

---
Se ainda houver dúvidas ou precisar de ajuda para configurar as variáveis no Vercel, avise que forneço instruções passo‑a‑passo com screenshots.
