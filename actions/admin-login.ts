'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function adminLoginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Hardcoded credentials as requested by user
  if (email === 'admin@admin.com' && password === 'admin123') {
    const cookieStore = await cookies()
    cookieStore.set('admin_bypass', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
    
    redirect('/admin')
  }

  return { error: 'Credenciais inválidas.' }
}

export async function adminLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_bypass')
  redirect('/admin/login')
}
