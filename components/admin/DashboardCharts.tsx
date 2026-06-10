'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DollarSign, Users, BookOpen, TrendingUp, RefreshCcw, CreditCard, Award } from 'lucide-react'

export default function DashboardCharts({
  receitaMensal,
  receitaTotal,
  alunosCount,
  novosAlunosMes,
  cursosVendidos,
  ticketMedio,
  reembolsos,
  revenueChartData,
  studentsChartData,
  completionRate,
  revenueGrowth,
}: {
  receitaMensal: number
  receitaTotal: number
  alunosCount: number
  novosAlunosMes: number
  cursosVendidos: number
  ticketMedio: number
  reembolsos: number
  revenueChartData: { name: string; total: number }[]
  studentsChartData: { name: string; users: number }[]
  completionRate: number
  revenueGrowth: number
}) {
  const refundRate = receitaTotal > 0 ? ((reembolsos / (cursosVendidos || 1)) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaMensal)}</div>
            <p className={`text-xs ${revenueGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{alunosCount}</div>
            <p className="text-xs text-muted-foreground">+{novosAlunosMes} novos este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticketMedio)}</div>
            <p className="text-xs text-muted-foreground">Valor médio por compra</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reembolsos</CardTitle>
            <RefreshCcw className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reembolsos}</div>
            <p className="text-xs text-muted-foreground">Taxa atual: {refundRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Crescimento da Receita</CardTitle>
            <CardDescription>Receita acumulada dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Novos Alunos (Semana)</CardTitle>
            <CardDescription>Cadastros realizados nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Receita Total</CardTitle>
            <CardDescription className="text-primary-foreground/80">Todas as vendas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black mt-2">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaTotal)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              Cursos Vendidos <BookOpen className="w-5 h-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black mt-2">{cursosVendidos}</div>
            <p className="text-sm text-muted-foreground mt-1">Total de compras concluídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              Taxa de Conclusão <Award className="w-5 h-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black mt-2">{completionRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">
              {completionRate >= 50 ? 'Acima da média da indústria' : 'Abaixo da média da indústria (68%)'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
