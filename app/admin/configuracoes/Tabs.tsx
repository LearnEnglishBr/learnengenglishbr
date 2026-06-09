'use client'

import { useState, type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id || '')

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-8 border-b border-border pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              active === tab.id
                ? 'bg-card text-primary border border-border border-b-white dark:border-b-card -mb-[1px]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find(t => t.id === active)?.content}
      </div>
    </div>
  )
}
