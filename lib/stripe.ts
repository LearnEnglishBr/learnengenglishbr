import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10', // Versão mais recente e estável do momento
  appInfo: {
    name: 'English School Premium SaaS',
    version: '1.0.0',
  },
})
