'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import { Plane, Briefcase, Mic, UserCheck, Globe, Award, BookOpen, Laptop, MousePointer } from 'lucide-react'

export const GoalDiscovery = () => {
  const { t } = useLanguage()
  const goals = [
    { id: 'travel',   icon: <Plane className="w-6 h-6 text-indigo-500" />,   label: 'Viajar' },
    { id: 'work',     icon: <Briefcase className="w-6 h-6 text-amber-500" />, label: 'Trabalho Internacional' },
    { id: 'speak',    icon: <Mic className="w-6 h-6 text-green-500" />,    label: 'Conversação' },
    { id: 'interview',icon: <UserCheck className="w-6 h-6 text-yellow-500" />,label: 'Entrevistas de Emprego' },
    { id: 'immigrate',icon: <Globe className="w-6 h-6 text-emerald-500" />, label: 'Imigração' },
    { id: 'cert',     icon: <Award className="w-6 h-6 text-purple-500" />,   label: 'Certificações' },
    { id: 'study',    icon: <BookOpen className="w-6 h-6 text-indigo-500" />, label: 'Estudos' },
    { id: 'remote',   icon: <Laptop className="w-6 h-6 text-primary" />,  label: 'Trabalho Remoto' },
  ]

  const [selected, setSelected] = useState<string | null>(null)

  const recommendations: Record<string, {
    min: string
    ideal: string
    time: string
    description: string[]
    success: { level: string; percent: number }[]
  }> = {
    travel: {
      min: 'A2',
      ideal: 'B1',
      time: '4 a 6 meses',
      description: [
        'Fazer check‑in em hotéis',
        'Pedir informações',
        'Conversar em restaurantes',
        'Resolver situações comuns durante viagens',
      ],
      success: [
        { level: 'A1', percent: 5 },
        { level: 'A2', percent: 15 },
        { level: 'B1', percent: 40 },
        { level: 'B2', percent: 75 },
        { level: 'C1', percent: 95 },
        { level: 'C2', percent: 100 },
      ],
    },
    work: {
      min: 'B2',
      ideal: 'C1',
      time: '8 a 12 meses',
      description: [
        'Participar de reuniões',
        'Escrever e-mails profissionais',
        'Conversar com clientes internacionais',
        'Fazer apresentações',
      ],
      success: [
        { level: 'A1', percent: 2 },
        { level: 'A2', percent: 5 },
        { level: 'B1', percent: 25 },
        { level: 'B2', percent: 60 },
        { level: 'C1', percent: 90 },
        { level: 'C2', percent: 100 },
      ],
    },
    speak: {
      min: 'B1',
      ideal: 'B2',
      time: '5 a 8 meses',
      description: [
        'Manter conversas cotidianas',
        'Entender falas normais em filmes e séries',
        'Participar de grupos de prática',
      ],
      success: [
        { level: 'A1', percent: 10 },
        { level: 'A2', percent: 30 },
        { level: 'B1', percent: 55 },
        { level: 'B2', percent: 85 },
        { level: 'C1', percent: 95 },
        { level: 'C2', percent: 100 },
      ],
    },
    interview: {
      min: 'B2',
      ideal: 'C1',
      time: '8 a 12 meses',
      description: [
        'Responder perguntas complexas',
        'Defender ideias',
        'Negociar salários',
        'Demonstrar experiência profissional',
      ],
      success: [
        { level: 'A1', percent: 1 },
        { level: 'A2', percent: 3 },
        { level: 'B1', percent: 20 },
        { level: 'B2', percent: 55 },
        { level: 'C1', percent: 90 },
        { level: 'C2', percent: 100 },
      ],
    },
    immigrate: {
      min: 'B2',
      ideal: 'C1',
      time: '8 a 12 meses',
      description: [
        'Entender processos de imigração',
        'Preparar documentos em inglês',
        'Realizar entrevistas oficiais',
        'Comunicar-se no novo país',
      ],
      success: [
        { level: 'A1', percent: 0 },
        { level: 'A2', percent: 2 },
        { level: 'B1', percent: 25 },
        { level: 'B2', percent: 65 },
        { level: 'C1', percent: 95 },
        { level: 'C2', percent: 100 },
      ],
    },
    cert: {
      min: 'Depende do exame',
      ideal: 'C1+',
      time: '10 a 14 meses',
      description: [
        'Estudar conteúdos específicos do exame escolhido (IELTS, TOEFL, CELPIP, PTE)',
        'Fazer simulados',
        'Focar em áreas de maior peso (listening, reading, writing, speaking)',
      ],
      success: [
        { level: 'A1', percent: 0 },
        { level: 'A2', percent: 1 },
        { level: 'B1', percent: 15 },
        { level: 'B2', percent: 45 },
        { level: 'C1', percent: 80 },
        { level: 'C2', percent: 95 },
      ],
    },
    study: {
      min: 'B1',
      ideal: 'B2',
      time: '5 a 9 meses',
      description: [
        'Ler textos acadêmicos',
        'Entender palestras universitárias',
        'Participar de discussões em grupo',
        'Produzir trabalhos escritos',
      ],
      success: [
        { level: 'A1', percent: 5 },
        { level: 'A2', percent: 20 },
        { level: 'B1', percent: 50 },
        { level: 'B2', percent: 80 },
        { level: 'C1', percent: 95 },
        { level: 'C2', percent: 100 },
      ],
    },
    remote: {
      min: 'B2',
      ideal: 'C1',
      time: '8 a 12 meses',
      description: [
        'Participar de reuniões virtuais',
        'Escrever e-mails profissionais',
        'Negociar projetos',
        'Apresentar resultados para equipes globais',
      ],
      success: [
        { level: 'A1', percent: 2 },
        { level: 'A2', percent: 5 },
        { level: 'B1', percent: 30 },
        { level: 'B2', percent: 70 },
        { level: 'C1', percent: 95 },
        { level: 'C2', percent: 100 },
      ],
    },
  };

  const renderSuccessBar = (levels: { level: string; percent: number }[]) => (
    <div className="flex space-x-1 overflow-x-auto py-2">
      {levels.map(l => (
        <div key={l.level} className="flex flex-col items-center w-12">
          <span className="text-xs font-medium">{l.level}</span>
          <div className="w-full h-4 bg-gray-200 rounded">
            <div
              className={`h-4 rounded ${l.percent >= 90 ? 'bg-primary' : l.percent >= 60 ? 'bg-green-500' : l.percent >= 30 ? 'bg-yellow-500' : 'bg-gray-400'}`}
              style={{ width: `${l.percent}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{l.percent}%</span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('Por que você quer aprender inglês?')}</h2>
        <p className="text-muted-foreground mb-8">{t('Selecione seu objetivo e descubra seu caminho personalizado para a fluência.')}</p>
        <div className="flex items-center justify-center gap-2 p-3 mb-6 bg-primary/10 text-primary border border-primary/20 rounded-lg"><MousePointer className="w-5 h-5" /> <span>{t('Selecione uma das opções abaixo para continuar')}</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-center">
          {goals.map(g => (
            <button
              key={g.id}
              onClick={() => setSelected(g.id)}
              className={`flex flex-col items-center p-4 rounded-xl border border-border/20 hover:border-primary transition-shadow shadow-sm hover:shadow-xl ${selected === g.id ? 'border-primary bg-primary/5' : ''}`}
            >
              <div className="flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">{g.icon}</div>
              <span className="font-medium">{t(g.label)}</span>
            </button>
          ))}
        </div>
        {selected && (
          <div className="mt-8 p-6 bg-card rounded-lg shadow-md text-left">
            <h3 className="text-xl font-semibold mb-2">{t('Objetivo selecionado')}: {goals.find(g => g.id === selected)?.label}</h3>
            <p className="mb-1"><strong>{t('Nível mínimo recomendado')}:</strong> {recommendations[selected].min}</p>
            <p className="mb-1"><strong>{t('Nível ideal')}:</strong> {recommendations[selected].ideal}</p>
            <p className="mb-2"><strong>{t('Tempo estimado')}:</strong> {recommendations[selected].time}</p>
            <p className="font-medium mb-2">{t('Competências necessárias')}:</p>
            <ul className="list-disc list-inside mb-2">
              {recommendations[selected].description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="font-medium mt-3 mb-2">{t('Chance de sucesso por nível')}:</p>
            {renderSuccessBar(recommendations[selected].success)}



          </div>
        )}
      </div>
    </section>
  )
}

