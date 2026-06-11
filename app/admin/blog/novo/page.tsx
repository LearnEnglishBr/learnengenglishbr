"use client"

import { useState, useRef } from 'react'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { SEOSidebar } from '@/components/admin/SEOSidebar'
import { generateFullArticleAction, saveBlogPostAction, aiAssistAction } from '@/actions/ai'
import { uploadFileAction } from '@/actions/upload'
import { Sparkles, Save, ArrowLeft, Loader2, PenTool, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewBlogPostPage() {
  const router = useRouter()
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('ai')

  // Form State (Manual / Final Data)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [categories, setCategories] = useState('') // comma separated for simplicity here
  const [tags, setTags] = useState('')
  const [contentHtml, setContentHtml] = useState('')

  // AI Form State
  const [aiTopic, setAiTopic] = useState('')
  const [aiKeyword, setAiKeyword] = useState('')
  const [aiAudience, setAiAudience] = useState('Estudantes de inglês brasileiro')
  const [aiWords, setAiWords] = useState('1200')
  const [aiTone, setAiTone] = useState('Profissional, educativo e persuasivo')
  const [aiModel, setAiModel] = useState('openai')

  // Loading States
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      const result = await generateFullArticleAction({
        topic: aiTopic,
        keyword: aiKeyword,
        audience: aiAudience,
        wordCount: aiWords,
        tone: aiTone,
        model: aiModel
      })

      if (result.error) {
        alert(result.error)
        return
      }

      if (result.success && result.data) {
        setTitle(result.data.title)
        setSlug(result.data.slug)
        setMetaTitle(result.data.metaTitle)
        setMetaDescription(result.data.metaDescription)
        setFocusKeyword(result.data.focusKeyword)
        setContentHtml(result.data.contentHtml)
        setCategories(result.data.suggestedCategories?.join(', ') || '')
        setTags(result.data.suggestedTags?.join(', ') || '')
        
        // Mudar para a aba manual para revisar
        setActiveTab('manual')
      }
    } catch (error) {
      alert('Erro inesperado na geração.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async (published: boolean) => {
    setIsSaving(true)
    try {
      // Calcular score final para salvar
      const contentText = contentHtml.replace(/<[^>]*>?/gm, ' ').toLowerCase()
      const wordCount = contentText.split(/\s+/).filter(w => w.length > 0).length
      const keywordCount = focusKeyword ? (contentText.match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length : 0
      const density = wordCount > 0 ? ((keywordCount * focusKeyword.split(' ').length) / wordCount) * 100 : 0
      
      let seoScore = 0
      if (focusKeyword) seoScore += 10
      if (title.toLowerCase().includes(focusKeyword.toLowerCase())) seoScore += 20
      if (metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) seoScore += 20
      if (density >= 0.5 && density <= 2.5) seoScore += 20
      if (wordCount >= 600) seoScore += 15
      if (contentHtml.includes('</h2>') && contentHtml.includes('</h3>')) seoScore += 15

      const payload = {
        title,
        slug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        focus_keyword: focusKeyword,
        content: contentHtml,
        cover_image_url: coverImageUrl,
        categories: categories.split(',').map(s => s.trim()).filter(Boolean),
        tags: tags.split(',').map(s => s.trim()).filter(Boolean),
        seo_score: seoScore,
        published
      }

      const res = await saveBlogPostAction(payload)
      if (res.error) {
        alert(res.error)
      } else {
        router.push('/admin/blog')
      }
    } catch (err) {
      alert('Erro ao salvar')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAIAssist = async (selectedText: string) => {
    const action = window.prompt("O que a IA deve fazer com este texto? (Digite: 'rewrite', 'expand', ou 'summarize')", "rewrite")
    if (action === 'rewrite' || action === 'expand' || action === 'summarize') {
      const res = await aiAssistAction(selectedText, action)
      if (res.success) {
        // Num cenário ideal, a gente injetaria o texto de volta no Tiptap usando comandos do editor,
        // mas como não temos a ref aqui facilmente, exibimos o resultado para o usuário copiar/colar
        alert(`SUGESTÃO DA IA:\n\n${res.text}\n\n(Copie este texto e cole no editor)`)
      } else {
        alert('Erro na IA.')
      }
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Novo Artigo</h1>
            <p className="text-muted-foreground">Crie conteúdo épico usando a inteligência artificial ou manualmente.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 border border-border rounded-md font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            Salvar Rascunho
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={isSaving || !title}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publicar Artigo
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8 gap-8">
        <button 
          onClick={() => setActiveTab('ai')}
          className={`pb-4 font-semibold text-sm flex items-center gap-2 transition-colors relative ${activeTab === 'ai' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Wand2 className="w-4 h-4" />
          Gerador Automático (IA)
          {activeTab === 'ai' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('manual')}
          className={`pb-4 font-semibold text-sm flex items-center gap-2 transition-colors relative ${activeTab === 'manual' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <PenTool className="w-4 h-4" />
          Editor e Detalhes
          {activeTab === 'manual' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      {/* Tab Content: AI Generator */}
      {activeTab === 'ai' && (
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Co-Piloto de Conteúdo
          </h2>
          <form onSubmit={handleGenerateAI} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1.5">Tópico ou Título Base</label>
                <input 
                  type="text" value={aiTopic} onChange={e => setAiTopic(e.target.value)} required
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Como aprender inglês em 6 meses"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1.5">Palavra-chave Foco (SEO)</label>
                <input 
                  type="text" value={aiKeyword} onChange={e => setAiKeyword(e.target.value)} required
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: aprender inglês rápido"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1.5">Público-alvo</label>
                <input 
                  type="text" value={aiAudience} onChange={e => setAiAudience(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1.5">Quantidade de Palavras</label>
                <select 
                  value={aiWords} onChange={e => setAiWords(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="600">Curto (~600 palavras)</option>
                  <option value="1200">Médio (~1200 palavras)</option>
                  <option value="2000">Longo/Guia Definitivo (~2000 palavras)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Tom de Voz</label>
                <input 
                  type="text" value={aiTone} onChange={e => setAiTone(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Modelo de IA</label>
                <select 
                  value={aiModel} onChange={e => setAiModel(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
<option value="openai">OpenAI (GPT-4o) - Padrão</option>
                   <option value="anthropic">Anthropic (Claude 3.5 Sonnet) - Excelente para redação</option>
                   <option value="google">Google (Gemini 1.5 Pro) - Melhor pesquisa técnica</option>
                   <option value="nvidia">NVIDIA (NeMo) - Modelo avançado</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Gerando artigo completo...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Iniciar Geração</>
              )}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-2">Isso pode levar de 15 a 30 segundos dependendo do tamanho solicitado.</p>
          </form>
        </div>
      )}

      {/* Tab Content: Manual / Editor */}
      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Campos e Editor */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg border-b border-border pb-3">Informações Básicas</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Título do Artigo (H1)</label>
                <input 
                  type="text" value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Slug (URL)</label>
                  <input 
                    type="text" value={slug} onChange={e => setSlug(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Imagem de Capa</label>
                  {/* Visualiza a imagem se houver URL */}
                  {coverImageUrl && (
                    <img src={coverImageUrl} alt="Capa" className="mb-2 w-full max-h-48 object-cover rounded" />
                  )}
                  <input 
                    type="text" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)}
                    placeholder="https://... (ou deixe vazio para upload)"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="coverUpload"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setCoverUploading(true)
                        const formData = new FormData()
                        formData.set('file', file)
                        formData.set('folder', '/blog_covers')
                        const res = await uploadFileAction(formData)
                        setCoverUploading(false)
                        if (res?.success) {
                          setCoverImageUrl(res.url)
                        } else {
                          alert(res?.error || 'Erro ao fazer upload da imagem')
                        }
                        // Reset file input
                        e.target.value = ''
                      }}
                    />
                    <label htmlFor="coverUpload" className={`cursor-pointer inline-flex items-center px-3 py-1.5 border border-input rounded-md text-sm ${coverUploading ? 'opacity-50 cursor-wait' : ''}`}>
                      {coverUploading ? 'Enviando...' : 'Upload da Imagem'}
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Categorias (separadas por vírgula)</label>
                  <input 
                    type="text" value={categories} onChange={e => setCategories(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tags (separadas por vírgula)</label>
                  <input 
                    type="text" value={tags} onChange={e => setTags(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg border-b border-border pb-3">Conteúdo Rico</h3>
              <TiptapEditor 
                content={contentHtml} 
                onChange={setContentHtml} 
                onAIAssist={handleAIAssist}
              />
            </div>
          </div>

          {/* Coluna Direita: SEO */}
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg border-b border-border pb-3">Otimização (SEO)</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Palavra-chave Foco</label>
                <input 
                  type="text" value={focusKeyword} onChange={e => setFocusKeyword(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Meta Title</label>
                <input 
                  type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
                  maxLength={60}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground mt-1 block text-right">{metaTitle.length}/60</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Meta Description</label>
                <textarea 
                  value={metaDescription} onChange={e => setMetaDescription(e.target.value)}
                  maxLength={160} rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <span className="text-xs text-muted-foreground mt-1 block text-right">{metaDescription.length}/160</span>
              </div>
            </div>

            {/* SEOSidebar renderiza pontuação e visualização baseada no estado */}
            <SEOSidebar 
              title={metaTitle || title} 
              content={contentHtml} 
              focusKeyword={focusKeyword} 
              metaDescription={metaDescription} 
            />
          </div>

        </div>
      )}
    </div>
  )
}
