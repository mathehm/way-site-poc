# 🎯 PoC Next.js Multi-Tenant

Prova de conceito (PoC) de uma aplicação **multi-tenant** em Next.js 14+ com App Router, identificação de tenant por subdomínio e suporte completo para deploy na Vercel.

## 📋 Sobre o Projeto

Esta PoC demonstra como construir uma plataforma SaaS multi-tenant onde cada "igreja" (tenant) possui:

- **Subdomínio próprio** (ex: `igreja-a.sua-plataforma.com`)
- **Domínio customizado** (ex: `www.igreja-vida.com.br`)
- **Layout e tema personalizados** (cores, logo, SEO)
- **Dados isolados** (eventos específicos por tenant)
- **Cache otimizado por tenant** (ISR + Edge)

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────┐
│  Request: igreja-a.sua-plataforma.com           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  middleware.ts │ ◄─── Edge Runtime
        └────────┬───────┘
                 │ Lê Host header
                 │ Identifica tenant
                 │ Injeta X-Tenant-* headers
                 ▼
        ┌────────────────┐
        │  Server        │
        │  Components    │ ◄─── Lê headers
        └────────┬───────┘      Aplica tema
                 │              Busca dados
                 ▼
        ┌────────────────┐
        │  HTML + CSS    │
        │  customizado   │
        └────────────────┘
```

### Componentes Principais

1. **[middleware.ts](middleware.ts)** - Identifica tenant pelo host no Edge Runtime
2. **[lib/tenant/config.ts](lib/tenant/config.ts)** - Configuração de todos os tenants
3. **[lib/tenant/resolve.ts](lib/tenant/resolve.ts)** - Helpers para acessar tenant atual
4. **[app/(site)/layout.tsx](app/(site)/layout.tsx)** - Layout com tema dinâmico
5. **[app/api/public/events/route.ts](app/api/public/events/route.ts)** - API com dados por tenant

## 🚀 Tenants Configurados

### Igreja A
- **Host**: `igreja-a.sua-plataforma.com` / `igreja-a.lvh.me`
- **Church ID**: `ch_01`
- **Cor primária**: `#2563eb` (azul)
- **Logo**: `/logos/a.svg`

### Igreja B
- **Host**: `igreja-b.sua-plataforma.com` / `igreja-b.lvh.me`
- **Church ID**: `ch_02`
- **Cor primária**: `#16a34a` (verde)
- **Logo**: `/logos/b.svg`

### Igreja Vida (Domínio Custom)
- **Host**: `www.igreja-vida.com.br` / `vida.lvh.me`
- **Church ID**: `ch_99`
- **Cor primária**: `#7c3aed` (roxo)
- **Logo**: `/logos/vida.svg`

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm/yarn/pnpm

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar localmente

```bash
npm run dev
```

### 3. Acessar via subdomínios locais

O serviço **lvh.me** resolve automaticamente para `127.0.0.1`, permitindo testar subdomínios localmente:

```
http://igreja-a.lvh.me:3000
http://igreja-b.lvh.me:3000
http://vida.lvh.me:3000
```

### 4. Testar via curl (alternativa)

Se preferir testar sem subdomínios, use o header `Host`:

```bash
# Igreja A
curl -H "Host: igreja-a.sua-plataforma.com" http://localhost:3000

# Igreja B
curl -H "Host: igreja-b.sua-plataforma.com" http://localhost:3000

# Igreja Vida
curl -H "Host: www.igreja-vida.com.br" http://localhost:3000
```

## 📁 Estrutura de Pastas

```
way-site/
├── app/
│   ├── (site)/                      # Grupo de rotas públicas
│   │   ├── layout.tsx               # Layout com tema por tenant
│   │   ├── page.tsx                 # Home page
│   │   ├── events/page.tsx          # Página de eventos
│   │   └── about/page.tsx           # Página sobre
│   │
│   ├── api/
│   │   └── public/
│   │       └── events/route.ts      # API de eventos por tenant
│   │
│   ├── sitemap.ts                   # Sitemap dinâmico
│   ├── robots.ts                    # Robots.txt dinâmico
│   └── globals.css                  # Estilos globais
│
├── lib/
│   ├── tenant/
│   │   ├── config.ts                # Configuração dos tenants
│   │   └── resolve.ts               # Helpers para Server Components
│   │
│   └── data/
│       └── events.ts                # Mock de dados por tenant
│
├── public/
│   └── logos/                       # Logos dos tenants
│       ├── a.svg
│       ├── b.svg
│       └── vida.svg
│
├── middleware.ts                    # Middleware Edge para detecção
└── README.md
```

## 🎨 Como Funciona: Layout por Tenant

### 1. Middleware detecta o tenant

```typescript
// middleware.ts
const tenant = getTenantByHost(hostname);
requestHeaders.set("X-Tenant-Id", tenant.churchId);
requestHeaders.set("X-Tenant-Slug", tenant.slug);
```

### 2. Layout lê os headers injetados

```typescript
// app/(site)/layout.tsx
const tenant = await getCurrentTenant();

const themeStyles = {
  "--primary": tenant.theme.primary,
} as React.CSSProperties;
```

### 3. Componentes usam CSS variables

```tsx
<h1 style={{ color: "var(--primary)" }}>
  {tenant.name}
</h1>
```

## 🔄 ISR e Cache por Tenant

### Páginas com ISR

Todas as páginas usam `revalidate = 60`:

```typescript
// app/(site)/page.tsx
export const revalidate = 60; // Revalidar a cada 60 segundos
```

### API com Cache Headers

```typescript
// app/api/public/events/route.ts
return NextResponse.json(data, {
  headers: {
    "Vary": "Host",  // Cache isolado por host
    "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
  },
});
```

**Como funciona na Vercel:**

- `Vary: Host` → garante cache separado por tenant
- `s-maxage=60` → cache na edge por 60 segundos
- `stale-while-revalidate=300` → serve versão antiga por 5min enquanto revalida

## 📡 API Routes

### GET /api/public/events

Retorna eventos do tenant identificado pelo host.

**Exemplo de resposta:**

```json
{
  "tenantId": "ch_01",
  "count": 3,
  "events": [
    {
      "id": "evt_01_01",
      "title": "Culto de Celebração",
      "description": "Venha celebrar conosco...",
      "date": "2025-12-01",
      "time": "19:00",
      "location": "Templo Central - Igreja A"
    }
  ]
}
```

**Testando via curl:**

```bash
curl -H "Host: igreja-a.sua-plataforma.com" \
     http://localhost:3000/api/public/events
```

## 🌍 Deploy na Vercel

### 1. Preparar domínios

#### Domínio Principal
- Adicione `sua-plataforma.com` no projeto Vercel

#### Wildcard Subdomain
- Adicione `*.sua-plataforma.com` no projeto Vercel
- Isso permite que todos os subdomínios funcionem automaticamente

#### Domínios Customizados (opcional)
- Adicione `www.igreja-vida.com.br` manualmente
- Configure DNS: CNAME → `cname.vercel-dns.com`

### 2. Deploy

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Configurar DNS

Para o domínio `sua-plataforma.com`:

```
Tipo    Nome    Valor
A       @       76.76.21.21
CNAME   *       cname.vercel-dns.com
```

### 4. Verificar funcionamento

```
https://igreja-a.sua-plataforma.com
https://igreja-b.sua-plataforma.com
https://www.igreja-vida.com.br
```

## 🔍 Como o Cache Funciona na Vercel

### Por que usar `Vary: Host`?

Sem `Vary: Host`, a Vercel Edge poderia servir o cache de um tenant para outro tenant.

**Exemplo sem `Vary`:**
1. User A acessa `igreja-a.sua-plataforma.com` → cache gerado
2. User B acessa `igreja-b.sua-plataforma.com` → **serve cache da Igreja A** ❌

**Solução com `Vary: Host`:**
1. User A acessa `igreja-a.sua-plataforma.com` → cache gerado (key: igreja-a...)
2. User B acessa `igreja-b.sua-plataforma.com` → cache gerado (key: igreja-b...) ✅

### ISR com Multi-Tenant

O Next.js automaticamente cria builds separados quando usa `headers()` em Server Components, garantindo que cada tenant tenha cache isolado.

## 🧪 Validando a PoC

### ✅ Checklist de Validação

- [ ] Acessar `igreja-a.lvh.me:3000` mostra tema azul
- [ ] Acessar `igreja-b.lvh.me:3000` mostra tema verde
- [ ] Acessar `vida.lvh.me:3000` mostra tema roxo
- [ ] SEO muda conforme tenant (ver source HTML)
- [ ] Eventos são diferentes por tenant
- [ ] API `/api/public/events` retorna dados corretos
- [ ] `curl` com header Host funciona
- [ ] Host desconhecido retorna 404

### Testando SEO por Tenant

```bash
# Ver meta tags do HTML
curl -s igreja-a.lvh.me:3000 | grep "<title>"
curl -s igreja-b.lvh.me:3000 | grep "<title>"
```

### Testando Eventos Diferentes

```bash
# Igreja A - 3 eventos
curl -H "Host: igreja-a.sua-plataforma.com" \
     http://localhost:3000/api/public/events | jq '.count'

# Igreja B - 3 eventos diferentes
curl -H "Host: igreja-b.sua-plataforma.com" \
     http://localhost:3000/api/public/events | jq '.count'
```

## 📚 Conceitos Importantes

### Server Components

Todas as páginas são Server Components (padrão no App Router):

- **Vantagem**: podem usar `await headers()` diretamente
- **Limitação**: não podem usar hooks do React (`useState`, `useEffect`)

### Edge Runtime vs Node Runtime

- **middleware.ts**: roda no Edge (CDN da Vercel)
- **Route Handlers**: rodam no Node (default) ou Edge (se especificado)
- **Server Components**: rodam no Node

### Headers Injetados

O middleware injeta headers customizados que "viajam" com a request:

```
Request original:
GET / HTTP/1.1
Host: igreja-a.sua-plataforma.com

↓ middleware.ts

Request modificada:
GET / HTTP/1.1
Host: igreja-a.sua-plataforma.com
X-Tenant-Id: ch_01
X-Tenant-Slug: igreja-a
```

## 🔧 Próximos Passos

Esta PoC é enxuta para validação. Para produção, considere:

### Banco de Dados
- Migrar de JSON para PostgreSQL/MongoDB
- Adicionar coluna `church_id` em todas as tabelas
- Implementar Row Level Security (RLS) no Supabase

### Autenticação
- Integrar NextAuth.js ou Clerk
- Associar usuários ao tenant na sessão

### Upload de Assets
- Permitir upload de logos customizados
- Usar Vercel Blob ou S3 com namespacing por tenant

### Telemetria
- Adicionar analytics por tenant
- Monitorar uso e performance por igreja

### Admin Dashboard
- Painel para gerenciar tenants
- CRUD de configurações (cores, logos, textos)

## 🐛 Troubleshooting

### Middleware não está funcionando

Verifique se o `matcher` no `middleware.ts` inclui a rota:

```typescript
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
```

### Tenant não encontrado localmente

Certifique-se de usar `.lvh.me:3000` e não `localhost:3000`.

### CSS variables não aplicadas

Verifique se o layout está usando `style={themeStyles}` no elemento `<body>`.

### Cache não funcionando por tenant

Adicione `Vary: Host` nos headers de resposta da API.

## 📄 Licença

Este projeto é uma PoC educacional. Sinta-se livre para usar como base.

## 🙋 Perguntas Frequentes

**Por que lvh.me funciona?**
O domínio `lvh.me` e todos seus subdomínios resolvem para `127.0.0.1` via DNS público.

**Posso usar domínios completamente diferentes?**
Sim! Basta adicionar cada domínio na Vercel e mapear no `lib/tenant/config.ts`.

**Como adicionar um novo tenant?**
1. Adicione entrada em `lib/tenant/config.ts`
2. Crie dados mockados em `lib/data/events.ts`
3. Adicione logo em `public/logos/`
4. Configure domínio na Vercel

**Precisa de rewrite para funcionar?**
Não! O middleware apenas injeta headers. O Next.js renderiza normalmente.

---

**Feito com Next.js 14+ 🚀**
