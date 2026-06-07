'use client'

import { useEffect, useState } from 'react'

export function YouTubePlayer({ url, onComplete }: { url: string, onComplete?: () => void }) {
  const [videoId, setVideoId] = useState<string | null>(null)

  useEffect(() => {
    // Extrai o ID do vídeo do YouTube de vários formatos possíveis
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      setVideoId(match[2])
    } else {
      setVideoId(null)
    }
  }, [url])

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-black/90 flex flex-col items-center justify-center text-white rounded-xl overflow-hidden shadow-2xl">
        <p className="text-muted-foreground">Vídeo indisponível ou URL inválida.</p>
      </div>
    )
  }

  // modestbranding=1: Tenta esconder a logo do YouTube
  // rel=0: Mostra vídeos relacionados apenas do próprio canal ao final
  // showinfo=0: (Depreciado pelo YT, mas mantido por compatibilidade)
  // controls=1: Mantém os controles básicos
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`}
        title="Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}
