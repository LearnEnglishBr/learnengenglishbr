'use client'

import { createDigitalProductAction, updateDigitalProductAction, uploadProductFileAction } from '@/actions/digital-products'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function NovoProdutoPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const router = useRouter()
  const isEditing = !!productId

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [price, setPrice] = useState('')
  const [showOnHomepage, setShowOnHomepage] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEditing || !productId) return
    const supabase = createClient()
    supabase
      .from('digital_products')
      .select('*')
      .eq('id', productId)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setTitle(data.title)
          setDescription(data.description || '')
          setFileUrl(data.file_url || '')
          setCoverImage(data.cover_image || '')
          setPrice(String(data.price))
          setShowOnHomepage(data.show_on_homepage)
        }
        setLoading(false)
      })
  }, [isEditing, productId])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.set('file', file)

    try {
      const result: any = await uploadProductFileAction(formData)
      if (result?.url) {
        setFileUrl(result.url)
      } else if (result?.error) {
        setError(result.error)
      }
    } catch {
      setError('Erro ao fazer upload do arquivo.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    if (isEditing && productId) {
      formData.set('id', productId)
    }

    try {
      if (isEditing) {
        await updateDigitalProductAction(formData)
      } else {
        await createDigitalProductAction(formData)
      }
      router.push('/admin/produtos')
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar produto.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/produtos"
          className="p-2 rounded-md hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Produto' : 'Criar Novo Produto'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? 'Altere as informações do produto digital.'
              : 'Preencha as informações do produto digital.'}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm space-y-6"
      >
        {isEditing && <input type="hidden" name="id" value={productId!} />}

        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: E-book Completo de Inglês"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o conteúdo do produto..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Arquivo do Produto</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                id="file_url"
                name="file_url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="URL do arquivo ou faça upload abaixo"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {uploading && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Enviando...
              </span>
            )}
            {fileUrl && !uploading && (
              <span className="text-sm text-green-600 whitespace-nowrap">
                Upload feito
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="cover_image" className="text-sm font-medium">
            URL da Imagem de Capa
          </label>
          <input
            type="text"
            id="cover_image"
            name="cover_image"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://exemplo.com/capa.jpg"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {coverImage && (
            <img
              src={coverImage}
              alt="Preview da capa"
              className="mt-2 w-32 h-32 object-cover rounded-md border border-border"
            />
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Preço (R$)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="49.90"
            className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="show_on_homepage"
            name="show_on_homepage"
            checked={showOnHomepage}
            onChange={(e) => setShowOnHomepage(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="show_on_homepage" className="text-sm font-medium cursor-pointer">
            Mostrar na página inicial
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? (
              'Salvando...'
            ) : (
              <>
                <Save className="w-4 h-4" />{' '}
                {isEditing ? 'Salvar Alterações' : 'Criar Produto'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
