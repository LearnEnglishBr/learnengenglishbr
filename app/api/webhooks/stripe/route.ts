import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const userId = session.metadata?.userId
    const courseId = session.metadata?.courseId

    if (userId && courseId) {
      // Registrar compra
      await supabase.from('purchases').insert({
        user_id: userId,
        course_id: courseId,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'COMPLETED'
      })

      // Inserir log de auditoria
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'COURSE_PURCHASED',
        resource: 'purchases',
        metadata: { courseId, stripeSession: session.id }
      })
    }
  }

  // Tratamento de reembolsos (charge.refunded)
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as any
    // Lógica para marcar purchase como REFUNDED na tabela purchases e refunds.
    // Opcional para esta fase inicial, mas estrutura pronta.
  }

  return new NextResponse('OK', { status: 200 })
}
