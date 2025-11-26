# 🏗️ Arquitetura Multi-Tenant

Este documento explica em detalhes como a arquitetura multi-tenant funciona nesta PoC.

## 📊 Fluxo de Requisição

```
┌─────────────────────────────────────────────────────────────────┐
│                          1. REQUEST                              │
│                                                                   │
│  Browser → igreja-a.sua-plataforma.com                          │
│            Host: igreja-a.sua-plataforma.com                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    2. VERCEL EDGE RUNTIME                        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  middleware.ts (Edge Runtime)                           │    │
│  │                                                          │    │
│  │  1. Lê hostname: "igreja-a.sua-plataforma.com"         │    │
│  │  2. Normaliza: lowercase, remove porta                  │    │
│  │  3. Busca tenant em getTenantByHost()                   │    │
│  │  4. Se não encontrar → return 404                       │    │
│  │  5. Se encontrar → injeta headers:                      │    │
│  │     - X-Tenant-Id: ch_01                                │    │
│  │     - X-Tenant-Slug: igreja-a                           │    │
│  │  6. NextResponse.next() com novos headers               │    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    3. NEXT.JS SERVER                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  app/(site)/layout.tsx                                  │    │
│  │                                                          │    │
│  │  const tenant = await getCurrentTenant()                │    │
│  │    ↳ Lê headers: X-Tenant-Slug                          │    │
│  │    ↳ Retorna config do tenant                           │    │
│  │                                                          │    │
│  │  Aplica:                                                 │    │
│  │  - CSS variables (--primary)                            │    │
│  │  - Logo                                                  │    │
│  │  - Metadata (SEO)                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  app/(site)/page.tsx                                    │    │
│  │                                                          │    │
│  │  Renderiza conteúdo usando:                             │    │
│  │  - tenant.name                                           │    │
│  │  - tenant.theme.primary (via CSS var)                   │    │
│  │                                                          │    │
│  │  export const revalidate = 60                           │    │
│  │  ↳ ISR: cache por 60 segundos                           │    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      4. RESPONSE                                 │
│                                                                   │
│  HTML customizado com tema da Igreja A                          │
│  - Title: "Igreja A - Bem-vindo"                                │
│  - Primary color: #2563eb (azul)                                │
│  - Logo: /logos/a.svg                                            │
│                                                                   │
│  Cache-Control headers:                                          │
│  - s-maxage=60 (cache na edge por 60s)                          │
│  - Vary: Host (cache isolado por hostname)                      │
└─────────────────────────────────────────────────────────────────┘
```

## 🔑 Componentes Chave

### 1. Tenant Config ([lib/tenant/config.ts](lib/tenant/config.ts))

**Responsabilidade:** Armazenar configuração de todos os tenants

```typescript
export interface TenantConfig {
  slug: string;           // Identificador único
  churchId: string;       // ID do banco de dados
  name: string;           // Nome de exibição
  hosts: string[];        // Domínios aceitos
  theme: {
    primary: string;      // Cor principal
    logo: string;         // Path do logo
  };
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
}
```

**Funções:**
- `getTenantByHost(host)` → busca tenant pelo hostname
- `getTenantBySlug(slug)` → busca tenant pelo slug
- `getTenantByChurchId(id)` → busca tenant pelo church ID

### 2. Middleware ([middleware.ts](middleware.ts))

**Runtime:** Edge (CDN)

**Fluxo:**

```typescript
export function middleware(request: NextRequest) {
  // 1. Extrair hostname
  const { hostname } = request.nextUrl;

  // 2. Normalizar
  const normalizedHost = hostname.toLowerCase().split(":")[0];

  // 3. Buscar tenant
  const tenant = getTenantByHost(normalizedHost);

  // 4. Validar
  if (!tenant) {
    return new NextResponse("Tenant not found", { status: 404 });
  }

  // 5. Injetar headers
  requestHeaders.set("X-Tenant-Id", tenant.churchId);
  requestHeaders.set("X-Tenant-Slug", tenant.slug);

  // 6. Continuar
  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

**Matcher Config:**
```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg)$).*)"
  ],
};
```

Isso garante que o middleware NÃO rode em:
- Arquivos estáticos (`_next/static`)
- Otimização de imagens (`_next/image`)
- Assets públicos (`.svg`, `.png`, `.jpg`)

### 3. Tenant Resolver ([lib/tenant/resolve.ts](lib/tenant/resolve.ts))

**Responsabilidade:** Server-side helpers para acessar tenant

```typescript
export async function getCurrentTenant(): Promise<TenantConfig | null> {
  const headersList = await headers();
  const tenantSlug = headersList.get("X-Tenant-Slug");

  if (!tenantSlug) return null;

  return getTenantBySlug(tenantSlug);
}
```

**Uso em Server Components:**

```tsx
// app/(site)/page.tsx
export default async function HomePage() {
  const tenant = await getCurrentTenant();

  return <h1>{tenant.name}</h1>;
}
```

### 4. Layout Dinâmico ([app/(site)/layout.tsx](app/(site)/layout.tsx))

**Responsabilidades:**
- Gerar metadata (SEO) por tenant
- Aplicar tema (CSS variables)
- Renderizar header/footer customizados

**Metadata:**

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();

  return {
    title: tenant.seo.title,
    description: tenant.seo.description,
    openGraph: {
      title: tenant.seo.title,
      description: tenant.seo.description,
      images: tenant.seo.ogImage ? [tenant.seo.ogImage] : [],
    },
  };
}
```

**Tema CSS:**

```typescript
const themeStyles = {
  "--primary": tenant.theme.primary,
  "--secondary": tenant.theme.secondary || tenant.theme.primary,
} as React.CSSProperties;

return (
  <body style={themeStyles}>
    {/* conteúdo */}
  </body>
);
```

**Uso nos componentes:**

```tsx
<h1 style={{ color: "var(--primary)" }}>
  {tenant.name}
</h1>
```

### 5. API Routes ([app/api/public/events/route.ts](app/api/public/events/route.ts))

**Responsabilidade:** Retornar dados isolados por tenant

```typescript
export async function GET() {
  const headersList = await headers();
  const tenantId = headersList.get("X-Tenant-Id");

  const events = getEventsByChurchId(tenantId);

  return NextResponse.json(
    { tenantId, count: events.length, events },
    {
      headers: {
        "Vary": "Host",  // ✅ Cache isolado por host
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
```

## 🎨 Sistema de Temas

### CSS Variables

Cada tenant tem sua cor primária definida no config:

```typescript
// lib/tenant/config.ts
{
  slug: "igreja-a",
  theme: {
    primary: "#2563eb",  // Azul
  }
}
```

O layout aplica isso como CSS variable:

```typescript
// app/(site)/layout.tsx
const themeStyles = {
  "--primary": tenant.theme.primary,
} as React.CSSProperties;
```

Componentes usam a variável:

```tsx
<button style={{ backgroundColor: "var(--primary)" }}>
  Clique aqui
</button>
```

### Logos

Cada tenant tem seu logo em `public/logos/`:

```
public/
└── logos/
    ├── a.svg      → Igreja A (azul)
    ├── b.svg      → Igreja B (verde)
    └── vida.svg   → Igreja Vida (roxo)
```

Referenciado no config:

```typescript
{
  slug: "igreja-a",
  theme: {
    logo: "/logos/a.svg",
  }
}
```

Renderizado no layout:

```tsx
<img src={tenant.theme.logo} alt={`${tenant.name} logo`} />
```

## 🗄️ Isolamento de Dados

### Estrutura de Dados

```typescript
// lib/data/events.ts
const eventsData: Record<string, Event[]> = {
  "ch_01": [ /* eventos da Igreja A */ ],
  "ch_02": [ /* eventos da Igreja B */ ],
  "ch_99": [ /* eventos da Igreja Vida */ ],
};
```

### Função de Busca

```typescript
export function getEventsByChurchId(churchId: string): Event[] {
  return eventsData[churchId] || [];
}
```

### Uso em Páginas

```typescript
// app/(site)/events/page.tsx
export default async function EventsPage() {
  const tenant = await getCurrentTenant();
  const events = getEventsByChurchId(tenant.churchId);

  return <EventList events={events} />;
}
```

## ⚡ Cache e Performance

### ISR (Incremental Static Regeneration)

Todas as páginas usam ISR:

```typescript
// app/(site)/page.tsx
export const revalidate = 60; // Revalidar a cada 60 segundos
```

**Como funciona:**

1. **Primeira requisição:** Next.js gera a página (SSR)
2. **Cache:** Resultado fica em cache por 60s
3. **Requisições seguintes:** Serve do cache (super rápido)
4. **Após 60s:** Próxima requisição serve cache, mas regenera em background
5. **Novas requisições:** Já servem a versão atualizada

### Vary: Host

**Por que é crítico:**

```typescript
// Sem Vary: Host ❌
User A → igreja-a.sua-plataforma.com
  ↳ Cache Key: /events
User B → igreja-b.sua-plataforma.com
  ↳ Cache Key: /events  (MESMO KEY!)
  ↳ Serve dados da Igreja A  💥 BUG!

// Com Vary: Host ✅
User A → igreja-a.sua-plataforma.com
  ↳ Cache Key: igreja-a.sua-plataforma.com:/events
User B → igreja-b.sua-plataforma.com
  ↳ Cache Key: igreja-b.sua-plataforma.com:/events
  ↳ Serve dados corretos da Igreja B  ✅
```

### Implementação

```typescript
// app/api/public/events/route.ts
return NextResponse.json(data, {
  headers: {
    "Vary": "Host",
    "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
  },
});
```

## 🌐 DNS e Domínios

### Subdomínios Wildcard

**DNS Config:**

```
Tipo    Nome    Valor
CNAME   *       cname.vercel-dns.com
```

Isso permite que QUALQUER subdomínio funcione:

- `igreja-a.sua-plataforma.com` ✅
- `igreja-b.sua-plataforma.com` ✅
- `nova-igreja.sua-plataforma.com` ✅ (se adicionar no config)

### Domínios Customizados

**DNS Config:**

```
Tipo    Nome              Valor
CNAME   www               cname.vercel-dns.com
CNAME   @                 cname.vercel-dns.com
```

Permite domínios completamente diferentes:

- `www.igreja-vida.com.br` ✅
- `igreja-vida.com.br` ✅

## 🧪 Testando Localmente

### lvh.me (Recomendado)

`lvh.me` e todos os subdomínios resolvem para `127.0.0.1`:

```bash
# Inicie o servidor
npm run dev

# Acesse no browser
http://igreja-a.lvh.me:3000
http://igreja-b.lvh.me:3000
http://vida.lvh.me:3000
```

### curl com Header Host (Alternativa)

```bash
curl -H "Host: igreja-a.sua-plataforma.com" http://localhost:3000
curl -H "Host: igreja-b.sua-plataforma.com" http://localhost:3000
```

### Script de Teste

```bash
chmod +x test-tenants.sh
./test-tenants.sh
```

## 📝 Adicionando um Novo Tenant

### 1. Adicionar no Config

```typescript
// lib/tenant/config.ts
export const tenants: TenantConfig[] = [
  // ... tenants existentes
  {
    slug: "nova-igreja",
    churchId: "ch_03",
    name: "Nova Igreja",
    hosts: [
      "nova-igreja.sua-plataforma.com",
      "nova-igreja.lvh.me",
    ],
    theme: {
      primary: "#ef4444",  // Vermelho
      logo: "/logos/nova.svg",
    },
    seo: {
      title: "Nova Igreja - Bem-vindo",
      description: "Nova Igreja - Uma nova comunidade",
    },
  },
];
```

### 2. Adicionar Dados

```typescript
// lib/data/events.ts
const eventsData: Record<string, Event[]> = {
  // ... dados existentes
  "ch_03": [
    {
      id: "evt_03_01",
      title: "Culto de Inauguração",
      description: "Venha celebrar nossa inauguração",
      date: "2025-12-20",
      time: "19:00",
      location: "Templo Central - Nova Igreja",
    },
  ],
};
```

### 3. Criar Logo

```bash
# Criar arquivo public/logos/nova.svg
```

### 4. Configurar na Vercel

1. Acesse o projeto na Vercel
2. Settings → Domains
3. Add Domain: `nova-igreja.sua-plataforma.com`
4. (Opcional) Add custom domain

### 5. Testar

```bash
# Local
http://nova-igreja.lvh.me:3000

# Produção
https://nova-igreja.sua-plataforma.com
```

## 🔒 Segurança

### Isolamento de Dados

Cada tenant só acessa seus próprios dados:

```typescript
// ✅ Correto
const events = getEventsByChurchId(tenant.churchId);

// ❌ NUNCA faça isso
const events = getEventsByChurchId(req.query.churchId); // Vulnerável!
```

### Validação de Host

O middleware valida TODOS os hosts:

```typescript
const tenant = getTenantByHost(hostname);

if (!tenant) {
  return new NextResponse("Tenant not found", { status: 404 });
}
```

Hosts não mapeados = 404 automático.

### Headers Injetados

Headers customizados não podem ser falsificados pelo cliente:

```
X-Tenant-Id: ch_01      ← Injetado pelo middleware (servidor)
X-Tenant-Slug: igreja-a  ← Cliente não pode modificar
```

## 🚀 Performance na Vercel

### Edge Runtime

- **middleware.ts** roda na edge (próximo ao usuário)
- Latência mínima (<50ms)
- Execução global (todas as regiões)

### ISR Global

- Cache na edge por tenant
- Revalidação em background
- Zero downtime durante rebuild

### Otimizações Automáticas

- Minificação
- Tree shaking
- Image optimization
- Font optimization
- Code splitting por rota

---

**Dúvidas?** Consulte o [README.md](README.md) principal!
