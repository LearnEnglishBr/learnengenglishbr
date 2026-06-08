"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import {
  Bold, Italic, Strikethrough, Heading2, Heading3,
  Quote, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, Film as YoutubeIcon, Sparkles
} from 'lucide-react'

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  onAIAssist?: (text: string) => void
}

const MenuBar = ({ editor, onAIAssist }: { editor: any, onAIAssist?: (text: string) => void }) => {
  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('URL da Imagem:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL do link:', previousUrl)
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addYoutubeVideo = () => {
    const url = window.prompt('URL do vídeo do YouTube:')
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      })
    }
  }

  const handleAIAssist = () => {
    if (onAIAssist) {
      // Pega o texto selecionado
      const selection = editor.state.selection
      const text = editor.state.doc.textBetween(selection.from, selection.to, ' ')
      if (text.trim() === '') {
        alert('Selecione um texto primeiro para usar a IA.')
        return
      }
      onAIAssist(text)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 border-b border-border rounded-t-md">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md hover:bg-muted transition-colors ${editor.isActive('bold') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Negrito"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md hover:bg-muted transition-colors ${editor.isActive('italic') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Itálico"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded-md hover:bg-muted transition-colors ${editor.isActive('strike') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Tachado"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-border mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-md hover:bg-muted transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Título 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-md hover:bg-muted transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Título 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-border mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-md hover:bg-muted transition-colors ${editor.isActive('blockquote') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Citação"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md hover:bg-muted transition-colors ${editor.isActive('bulletList') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Lista de Pontos"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-md hover:bg-muted transition-colors ${editor.isActive('orderedList') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Lista Numérica"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-border mx-1" />
      <button
        type="button"
        onClick={setLink}
        className={`p-2 rounded-md hover:bg-muted transition-colors ${editor.isActive('link') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Inserir Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={addImage}
        className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
        title="Inserir Imagem (URL)"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={addYoutubeVideo}
        className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
        title="Embed YouTube"
      >
        <YoutubeIcon className="w-4 h-4" />
      </button>
      
      {onAIAssist && (
        <>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            type="button"
            onClick={handleAIAssist}
            className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 font-medium text-xs"
            title="Reescrever/Expandir seleção com IA"
          >
            <Sparkles className="w-4 h-4" /> IA
          </button>
        </>
      )}
    </div>
  )
}

export function TiptapEditor({ content, onChange, onAIAssist }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg shadow-sm',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sincronizar mudança externa (quando a IA gera o artigo completo)
  // Sem re-renderizar em loop se for a mesma coisa.
  // UseEffect foi simplificado: usamos a key ou o state manager do pai no mundo real, mas para este MVP, checamos:
  if (editor && content !== editor.getHTML() && content !== '<p></p>' && editor.getHTML() === '<p></p>') {
      // Apenas um load inicial rude caso venha assíncrono
      setTimeout(() => editor.commands.setContent(content), 0)
  }

  return (
    <div className="border border-border rounded-md overflow-hidden bg-card focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-shadow">
      <MenuBar editor={editor} onAIAssist={onAIAssist} />
      <div className="bg-background">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
