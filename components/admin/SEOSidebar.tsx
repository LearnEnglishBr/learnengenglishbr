"use client"

import { useMemo } from 'react'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface SEOSidebarProps {
  title: string
  content: string
  focusKeyword: string
  metaDescription: string
}

export function SEOSidebar({ title, content, focusKeyword, metaDescription }: SEOSidebarProps) {
  
  const analysis = useMemo(() => {
    const keyword = focusKeyword.trim().toLowerCase()
    const contentText = content.replace(/<[^>]*>?/gm, ' ').toLowerCase() // Strip HTML
    const titleLower = title.toLowerCase()
    const metaLower = metaDescription.toLowerCase()

    const wordCount = contentText.split(/\s+/).filter(w => w.length > 0).length
    
    // Checks
    const hasKeywordInTitle = keyword ? titleLower.includes(keyword) : false
    const hasKeywordInMeta = keyword ? metaLower.includes(keyword) : false
    
    // Keyword Density
    const keywordCount = keyword && keyword.length > 0 ? (contentText.match(new RegExp(keyword, 'g')) || []).length : 0
    const density = wordCount > 0 ? ((keywordCount * keyword.split(' ').length) / wordCount) * 100 : 0
    const isDensityGood = density >= 0.5 && density <= 2.5

    // Word Count Check
    const isLengthGood = wordCount >= 600 // For long form SEO

    // H2/H3 Check
    const hasH2 = content.includes('</h2>')
    const hasH3 = content.includes('</h3>')

    // Calc Score (0 to 100)
    let score = 0
    if (keyword) score += 10
    if (hasKeywordInTitle) score += 20
    if (hasKeywordInMeta) score += 20
    if (isDensityGood) score += 20
    if (isLengthGood) score += 15
    if (hasH2 && hasH3) score += 15

    return {
      keyword,
      wordCount,
      density: density.toFixed(2),
      hasKeywordInTitle,
      hasKeywordInMeta,
      isDensityGood,
      isLengthGood,
      hasH2,
      hasH3,
      score
    }
  }, [title, content, focusKeyword, metaDescription])

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-6">
      <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
        SEO Score
        <span className={`px-2 py-1 rounded text-sm font-bold ${
          analysis.score >= 80 ? 'bg-green-100 text-green-800' : 
          analysis.score >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>
          {analysis.score}/100
        </span>
      </h3>

      {!analysis.keyword && (
        <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md mb-4 border border-yellow-200">
          Adicione uma palavra-chave foco para ativar a análise de SEO.
        </div>
      )}

      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-2">
          {analysis.hasKeywordInTitle ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
          <span>Palavra-chave no Título Principal</span>
        </div>
        
        <div className="flex items-start gap-2">
          {analysis.hasKeywordInMeta ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
          <span>Palavra-chave na Meta Description</span>
        </div>

        <div className="flex items-start gap-2">
          {analysis.isDensityGood ? (
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          ) : (
            analysis.density === "0.00" ? <XCircle className="w-5 h-5 text-red-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
          )}
          <span>Densidade da palavra-chave: {analysis.density}% (Ideal 0.5% - 2.5%)</span>
        </div>

        <div className="flex items-start gap-2">
          {analysis.isLengthGood ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />}
          <span>Tamanho do conteúdo: {analysis.wordCount} palavras (Ideal {'>'} 600)</span>
        </div>

        <div className="flex items-start gap-2">
          {analysis.hasH2 && analysis.hasH3 ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />}
          <span>Uso de Subtítulos H2 e H3 (Semântica estrutural)</span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-semibold mb-2">Previsão no Google</h4>
        <div className="bg-background border border-border p-3 rounded-md">
          <div className="text-[#1a0dab] text-lg hover:underline truncate cursor-pointer font-medium">
            {title || 'Título do seu artigo aparecerá aqui'}
          </div>
          <div className="text-[#006621] text-sm truncate mb-1">
            learningenglishbr.com.br/blog/{title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'slug'}
          </div>
          <div className="text-[#545454] text-sm line-clamp-2 leading-snug">
            {metaDescription || 'A meta description otimizada aparecerá aqui para convencer o usuário a clicar no seu resultado em vez dos concorrentes.'}
          </div>
        </div>
      </div>
    </div>
  )
}
