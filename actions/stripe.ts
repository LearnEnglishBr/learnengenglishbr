'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export async function createCheckoutSessionAction(courseId: string, courseTitle: string, price: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/cursos')
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'boleto', 'pix'],
    billing_address_collection: 'required',
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: courseTitle,
          },
          unit_amount: Math.round(price * 100), // Stripe usa centavos
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cursos?canceled=true`,
    metadata: {
      userId: user.id,
      courseId: courseId,
    },
  })

  if (session.url) {
    redirect(session.url)
  } else {
    throw new Error('Falha ao criar sessão de pagamento.')
  }
}
