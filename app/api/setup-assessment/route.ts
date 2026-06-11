import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST(req: NextRequest) {
  try {
    const { dbPassword } = await req.json()

    if (!dbPassword) {
      return NextResponse.json(
        { error: 'Senha do banco de dados é obrigatória. Encontre em: Supabase Dashboard > Project Settings > Database > Database password' },
        { status: 400 }
      )
    }

    const projectRef = 'upiiphtxyybycibdnflv'
    const connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require`

    const { Client } = require('pg')
    const client = new Client({ connectionString })
    await client.connect()

    const sqlPath = join(process.cwd(), 'supabase', 'migrations', 'testeinicial.sql')
    const sql = readFileSync(sqlPath, 'utf-8')

    await client.query(sql)

    await client.end()

    return NextResponse.json({ success: true, message: 'Tabelas e dados de seed criados com sucesso!' })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro ao executar setup' },
      { status: 500 }
    )
  }
}
