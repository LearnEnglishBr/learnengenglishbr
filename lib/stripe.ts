import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia', // Versão exigida pelo SDK instalado
  appInfo: {
    name: 'English School Premium SaaS',
    version: '1.0.0',
  },
})
