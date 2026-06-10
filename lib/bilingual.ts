// Bilingual helpers: values are stored as {pt, en} or as plain string (backwards compat)

export function pt(value: any): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') return value.pt ?? ''
  return ''
}

export function en(value: any): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') return value.en ?? value.pt ?? ''
  return ''
}

export function localeValue(value: any, locale: 'pt' | 'en'): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    if (locale === 'en' && value.en != null) return value.en
    return value.pt ?? ''
  }
  return ''
}
