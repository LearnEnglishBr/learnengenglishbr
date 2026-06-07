'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Note: O ideal é usar o SDK oficial da OpenAI importando 'openai'
// Aqui usamos fetch para reduzir dependências e ilustrar a Server Action direta.

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

export async function generateBlogPostAction(formData: FormData) {
  const keyword = formData.get('keyword') as string

  if (!keyword || keyword.trim() === '') {
    return { error: 'A palavra-chave é obrigatória.' }
  }

  if (!OPENAI_API_KEY) {
    return { error: 'API Key da OpenAI não configurada (OPENAI_API_KEY).' }
  }

  try {
    // 1. Verificar admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { error: 'Não autorizado.' }
    
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'ADMIN') return { error: 'Sem permissão.' }

    // 2. Chamar a IA (GPT-4o) para gerar um artigo otimizado para SEO
    const prompt = `Você é um copywriter e especialista em SEO (AEO - Answer Engine Optimization) de uma escola de inglês premium.
    Crie um artigo de blog altamente engajador, longo e técnico focado na palavra-chave/tópico: "${keyword}".
    
    O artigo deve ser retornado em formato HTML puro (apenas as tags de conteúdo, começando por um <h1> para o título, seguido de parágrafos, <h2>, listas, etc). 
    Não coloque tags <html> ou <body>, apenas o conteúdo interno.
    Gere conteúdo que traga respostas profundas para os leitores.`

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    })

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text()
      console.error('OpenAI Error:', errorData)
      return { error: 'Falha ao se comunicar com a OpenAI.' }
    }

    const aiData = await aiResponse.json()
    const contentHtml = aiData.choices[0].message.content

    // 3. Gerar Slug e Título
    // Extrai o h1 para o titulo
    const titleMatch = contentHtml.match(/<h1>(.*?)<\/h1>/)
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : `Artigo sobre ${keyword}`
    const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    // 4. Salvar no Supabase
    const { error: dbError } = await supabase.from('blog_posts').insert({
      title,
      slug,
      content: contentHtml,
      excerpt: contentHtml.replace(/<[^>]+>/g, '').substring(0, 150) + '...',
      author_id: user.id,
      published: true
    })

    if (dbError) {
      console.error('Supabase Error:', dbError)
      return { error: 'Falha ao salvar o artigo no banco de dados.' }
    }

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    
    return { success: true }

  } catch (error: any) {
    console.error('Action Error:', error)
    return { error: 'Ocorreu um erro inesperado: ' + error.message }
  }
}
