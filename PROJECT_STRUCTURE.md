# 📂 Estrutura do Projeto

Visão completa da arquitetura de arquivos da PoC Multi-Tenant.

```
way-site/
│
├── 📱 app/                                 # Next.js App Router
│   │
│   ├── 🌐 (site)/                          # Route Group - Páginas públicas
│   │   ├── layout.tsx                     # ⭐ Layout multi-tenant com tema dinâmico
│   │   ├── page.tsx                       # Home page com ISR (revalidate: 60s)
│   │   ├── events/
│   │   │   └── page.tsx                   # Lista de eventos por tenant
│   │   └── about/
│   │       └── page.tsx                   # Página sobre personalizada
│   │
│   ├── 🔌 api/
│   │   └── public/
│   │       └── events/
│   │           └── route.ts               # ⭐ API de eventos com Vary: Host
│   │
│   ├── sitemap.ts                         # Sitemap dinâmico por tenant
│   ├── robots.ts                          # Robots.txt dinâmico por tenant
│   └── globals.css                        # Estilos globais (Tailwind)
│
├── 🧩 lib/                                 # Lógica de negócio
│   │
│   ├── 🏢 tenant/                          # Sistema Multi-Tenant
│   │   ├── config.ts                      # ⭐ Configuração de todos os tenants
│   │   └── resolve.ts                     # ⭐ Helpers para Server Components
│   │
│   └── 📊 data/                            # Mock de dados
│       └── events.ts                      # Eventos por tenant (ch_01, ch_02, ch_99)
│
├── 🎨 public/                              # Assets estáticos
│   └── logos/                             # Logos dos tenants
│       ├── a.svg                          # Igreja A (azul)
│       ├── b.svg                          # Igreja B (verde)
│       └── vida.svg                       # Igreja Vida (roxo)
│
├── ⚙️ middleware.ts                        # ⭐ Detecta tenant pelo host (Edge Runtime)
│
├── 📄 Configurações
│   ├── package.json                       # Dependências do projeto
│   ├── tsconfig.json                      # TypeScript config com alias @/*
│   ├── next.config.ts                     # Config do Next.js
│   ├── tailwind.config.ts                 # Config do Tailwind CSS
│   └── postcss.config.mjs                 # Config do PostCSS
│
├── 📚 Documentação
│   ├── README.md                          # ⭐ Documentação principal completa
│   ├── QUICKSTART.md                      # ⚡ Guia de 5 minutos
│   ├── ARCHITECTURE.md                    # 🏗️ Arquitetura detalhada
│   ├── EXAMPLES.md                        # 💡 18 exemplos práticos
│   └── PROJECT_STRUCTURE.md               # 📂 Este arquivo
│
└── 🧪 test-tenants.sh                      # Script para testar tenants via curl

⭐ = Arquivo crítico para multi-tenancy
```

## 🎯 Arquivos Críticos (Core)

### 1. [middleware.ts](middleware.ts)

```typescript
// Roda no Edge Runtime (CDN)
// Responsabilidade: Detectar tenant pelo hostname

Request → middleware.ts → Identifica tenant → Injeta headers
```

**O que faz:**
- Lê `hostname` da request
- Normaliza (lowercase, remove porta)
- Busca tenant em `getTenantByHost()`
- Injeta headers: `X-Tenant-Id`, `X-Tenant-Slug`
- Retorna 404 se tenant não existe

---

### 2. [lib/tenant/config.ts](lib/tenant/config.ts)

```typescript
// Configuração estática de todos os tenants
// Em produção → banco de dados

export const tenants: TenantConfig[] = [...]
```

**O que contém:**
- Array com todos os tenants
- Config de cada tenant: slug, churchId, hosts, theme, seo
- Funções helper: `getTenantByHost()`, `getTenantBySlug()`

---

### 3. [lib/tenant/resolve.ts](lib/tenant/resolve.ts)

```typescript
// Server-side helpers
// Uso: Server Components e API Routes

const tenant = await getCurrentTenant();
```

**O que faz:**
- Lê headers injetados pelo middleware
- Retorna objeto `TenantConfig` completo
- Usado em TODOS os Server Components

---

### 4. [app/(site)/layout.tsx](app/(site)/layout.tsx)

```typescript
// Layout raiz com tema dinâmico
// Aplica: CSS vars, logo, metadata

export async function generateMetadata() {...}
export default async function SiteLayout() {...}
```

**O que faz:**
- Gera metadata (SEO) por tenant
- Aplica CSS variables (`--primary`, `--secondary`)
- Renderiza header com logo e menu
- Renderiza footer com informações do tenant

---

### 5. [app/api/public/events/route.ts](app/api/public/events/route.ts)

```typescript
// API Route com dados isolados por tenant
// Cache com Vary: Host

export async function GET() {...}
```

**O que faz:**
- Lê `X-Tenant-Id` dos headers
- Busca eventos do tenant
- Retorna JSON com cache headers
- **Crítico:** `Vary: Host` para cache isolado

---

## 📊 Fluxo de Dados

```
┌────────────────────────────────────────────────────────────┐
│ 1. REQUEST                                                  │
│    igreja-a.sua-plataforma.com                             │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────┐
│ 2. MIDDLEWARE.TS                                            │
│    getTenantByHost("igreja-a.sua-plataforma.com")          │
│    ↓                                                        │
│    tenant = { slug: "igreja-a", churchId: "ch_01", ... }   │
│    ↓                                                        │
│    Injeta headers: X-Tenant-Id, X-Tenant-Slug             │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────┐
│ 3. APP/(SITE)/LAYOUT.TSX                                    │
│    const tenant = await getCurrentTenant()                  │
│    ↓                                                        │
│    Lê X-Tenant-Slug → getTenantBySlug("igreja-a")          │
│    ↓                                                        │
│    Aplica tema: --primary: #2563eb                         │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────┐
│ 4. APP/(SITE)/PAGE.TSX                                      │
│    const tenant = await getCurrentTenant()                  │
│    ↓                                                        │
│    Renderiza com: tenant.name, tenant.theme.primary        │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────┐
│ 5. RESPONSE                                                 │
│    HTML com tema azul da Igreja A                          │
└────────────────────────────────────────────────────────────┘
```

## 🔍 Como Encontrar Coisas

### Adicionar novo tenant

📍 [lib/tenant/config.ts](lib/tenant/config.ts)

```typescript
export const tenants: TenantConfig[] = [
  // Adicionar novo objeto aqui
  {
    slug: "nova",
    churchId: "ch_04",
    // ...
  }
];
```

### Adicionar dados mockados

📍 [lib/data/events.ts](lib/data/events.ts)

```typescript
const eventsData: Record<string, Event[]> = {
  ch_04: [
    // Adicionar eventos aqui
  ]
};
```

### Criar nova página

📍 [app/(site)/nova-pagina/page.tsx](app/(site)/)

```typescript
import { getCurrentTenant } from "@/lib/tenant/resolve";

export const revalidate = 60;

export default async function NovaPagina() {
  const tenant = await getCurrentTenant();
  return <div>{tenant.name}</div>;
}
```

### Criar nova API

📍 [app/api/public/nova-api/route.ts](app/api/public/)

```typescript
import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();
  const tenantId = headersList.get("X-Tenant-Id");

  return NextResponse.json({ tenantId });
}
```

### Modificar tema

📍 [lib/tenant/config.ts](lib/tenant/config.ts)

```typescript
theme: {
  primary: "#ef4444",  // Mudar cor aqui
  logo: "/logos/novo.svg",  // Mudar logo aqui
}
```

### Adicionar CSS variable

📍 [app/(site)/layout.tsx](app/(site)/layout.tsx)

```typescript
const themeStyles = {
  "--primary": tenant.theme.primary,
  "--secondary": tenant.theme.secondary,
  "--accent": tenant.theme.accent,  // Nova variável
} as React.CSSProperties;
```

## 📦 Dependências

```json
{
  "dependencies": {
    "next": "16.0.4",        // Framework
    "react": "19.2.0",       // UI library
    "react-dom": "19.2.0"    // React DOM
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",  // Tailwind v4
    "typescript": "^5",            // TypeScript
    "eslint": "^9"                 // Linting
  }
}
```

**Mínimo:** Apenas Next.js, React e TailwindCSS. Sem bibliotecas extras.

## 🚀 Commands

```bash
# Desenvolvimento
npm run dev          # Inicia servidor dev em localhost:3000

# Build
npm run build        # Compila para produção
npm run start        # Inicia servidor de produção

# Lint
npm run lint         # ESLint check

# Testes
./test-tenants.sh    # Testa todos os tenants via curl
```

## 🎨 Convenções de Código

### Imports

```typescript
// Absolutos com @/
import { getCurrentTenant } from "@/lib/tenant/resolve";

// Não usar relativos
// import { getCurrentTenant } from "../../lib/tenant/resolve"; ❌
```

### Nomenclatura

- **Arquivos:** kebab-case (`tenant-config.ts`)
- **Componentes:** PascalCase (`TenantLayout`)
- **Funções:** camelCase (`getCurrentTenant`)
- **Constantes:** UPPER_SNAKE_CASE (`MAX_EVENTS`)

### Server Components

```typescript
// ✅ Correto - async + await
export default async function Page() {
  const tenant = await getCurrentTenant();
  return <div>{tenant.name}</div>;
}

// ❌ Errado - sem async
export default function Page() {
  const tenant = getCurrentTenant(); // Erro!
  return <div>{tenant.name}</div>;
}
```

## 🔐 Segurança

### Headers Injetados

**✅ Seguro:**
```typescript
const tenantId = headersList.get("X-Tenant-Id"); // Injetado pelo middleware
```

**❌ Inseguro:**
```typescript
const tenantId = request.query.tenantId; // Cliente pode falsificar
```

### Isolamento de Dados

**✅ Seguro:**
```typescript
const events = getEventsByChurchId(tenant.churchId);
```

**❌ Inseguro:**
```typescript
const events = getEventsByChurchId(request.query.churchId);
```

## 📊 Tamanhos

| Arquivo | Linhas | Descrição |
|---------|--------|-----------|
| middleware.ts | ~50 | Edge detection |
| lib/tenant/config.ts | ~100 | Config estática |
| lib/tenant/resolve.ts | ~30 | Server helpers |
| app/(site)/layout.tsx | ~120 | Layout dinâmico |
| app/(site)/page.tsx | ~100 | Home page |
| app/api/public/events/route.ts | ~40 | API endpoint |

**Total:** ~440 linhas de código core (sem contar páginas adicionais)

## 🎯 Próximos Passos

Para evoluir esta PoC para produção:

1. **Banco de Dados** → [lib/tenant/config.ts](lib/tenant/config.ts)
2. **Autenticação** → [middleware.ts](middleware.ts) + NextAuth
3. **Upload de Assets** → [app/api/upload/route.ts](app/api/)
4. **Testes** → `__tests__/` directory
5. **CI/CD** → `.github/workflows/`
6. **Monitoramento** → Sentry, Datadog, etc.

---

**Dúvidas sobre a estrutura?** Consulte [ARCHITECTURE.md](ARCHITECTURE.md) para detalhes técnicos!
