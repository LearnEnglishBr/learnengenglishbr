export function SocialProof() {
  const exams = ['TOEFL iBT', 'IELTS', 'Cambridge', 'TOEIC', 'Duolingo Test']
  
  return (
    <section className="py-12 border-y border-border bg-muted/10">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
          Metodologia direcionada para a aprovação nas principais certificações internacionais
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-all duration-500">
          {exams.map((exam, idx) => (
            <div key={idx} className="text-xl md:text-2xl font-black text-foreground tracking-tighter">
              {exam}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
