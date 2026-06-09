'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const onboardingSchema = z.object({
  cpf: z.string().min(11, 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  zip_code: z.string().min(8, 'CEP inválido'),
  street: z.string().min(3, 'Rua inválida'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().min(2, 'Estado inválido'),
  country: z.string().min(2, 'País inválido'),
})

export async function completeOnboardingAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const rawData = {
    cpf: formData.get('cpf') as string,
    phone: formData.get('phone') as string,
    zip_code: formData.get('zip_code') as string,
    street: formData.get('street') as string,
    number: formData.get('number') as string,
    complement: formData.get('complement') as string,
    neighborhood: formData.get('neighborhood') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    country: formData.get('country') as string,
  }

  const terms = formData.get('terms')

  if (!terms) {
    return { error: 'Você deve aceitar os Termos de Uso e Política de Privacidade.' }
  }

  const parsed = onboardingSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      cpf: rawData.cpf,
      phone: rawData.phone,
      zip_code: rawData.zip_code,
      street: rawData.street,
      number: rawData.number,
      complement: rawData.complement,
      neighborhood: rawData.neighborhood,
      city: rawData.city,
      state: rawData.state,
      country: rawData.country,
      terms_accepted: true,
      privacy_accepted: true,
      accepted_at: new Date().toISOString(),
      status: 'ACTIVE'
    })
    .eq('id', user.id)

  if (error) {
    if (error.code === '23505' && error.message.includes('cpf')) {
      return { error: 'Este CPF já está cadastrado.' }
    }
    return { error: 'Erro ao salvar os dados. Tente novamente.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
