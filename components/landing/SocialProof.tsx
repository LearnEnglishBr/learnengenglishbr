export function SocialProof() {
  const logos = ['Google', 'Microsoft', 'Amazon', 'IBM', 'Meta', 'Accenture']
  
  return (
    <section className="py-12 border-y border-border bg-muted/10">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
          Certificado reconhecido por profissionais que atuam nas maiores empresas do mundo
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, idx) => (
            <div key={idx} className="text-xl md:text-2xl font-black text-foreground tracking-tighter">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
