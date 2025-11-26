# ⚡ Quick Start - 5 Minutos

Guia rápido para ter a PoC Multi-Tenant rodando em 5 minutos.

## 🚀 Setup Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Abrir no navegador
# Igreja A (azul):
open http://igreja-a.lvh.me:3000

# Igreja B (verde):
open http://igreja-b.lvh.me:3000

# Igreja Vida (roxo):
open http://vida.lvh.me:3000
```

## ✅ Checklist de Validação

Abra cada URL e verifique:

- [ ] **Igreja A** → Logo azul, título "Igreja A", cor #2563eb
- [ ] **Igreja B** → Logo verde, título "Igreja B", cor #16a34a
- [ ] **Igreja Vida** → Logo roxo, título "Igreja Vida", cor #7c3aed

Navegue para `/events` em cada tenant:

- [ ] **Igreja A** → 3 eventos (Culto de Celebração, Encontro de Jovens, EBD)
- [ ] **Igreja B** → 3 eventos diferentes (Vigília, Café com Propósito, Conferência)
- [ ] **Igreja Vida** → 3 eventos diferentes (Experiência Vida, Vida Kids, Retiro)

## 🧪 Testar via API

```bash
# Igreja A - eventos
curl -H "Host: igreja-a.sua-plataforma.com" \
     http://localhost:3000/api/public/events | jq

# Igreja B - eventos
curl -H "Host: igreja-b.sua-plataforma.com" \
     http://localhost:3000/api/public/events | jq

# Host inválido (deve retornar 404)
curl -i -H "Host: invalido.com" http://localhost:3000
```

## 📦 Build para Produção

```bash
# Build
npm run build

# Iniciar produção
npm start

# Acessar
open http://igreja-a.lvh.me:3000
```

## 🌍 Deploy na Vercel

```bash
# 1. Instalar CLI da Vercel
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Configurar domínio
# - Acesse o projeto na Vercel
# - Settings → Domains
# - Add: *.sua-plataforma.com
# - Add: www.igreja-vida.com.br
```

## 📖 Estrutura dos Arquivos

```
📁 Arquivos Principais
├── middleware.ts                   → Detecta tenant pelo host
├── lib/tenant/config.ts           → Config de todos os tenants
├── lib/tenant/resolve.ts          → Helpers para Server Components
├── app/(site)/layout.tsx          → Layout com tema dinâmico
├── app/(site)/page.tsx            → Home page
├── app/(site)/events/page.tsx     → Página de eventos
├── app/(site)/about/page.tsx      → Página sobre
├── app/api/public/events/route.ts → API de eventos
└── lib/data/events.ts             → Mock de dados

📁 Assets
└── public/logos/                   → Logos dos tenants
    ├── a.svg
    ├── b.svg
    └── vida.svg

📁 Documentação
├── README.md                       → Documentação completa
├── ARCHITECTURE.md                 → Arquitetura detalhada
├── EXAMPLES.md                     → Exemplos de código
└── QUICKSTART.md                   → Este arquivo
```

## 🎯 Próximos Passos

### 1. Adicionar um Novo Tenant

```typescript
// lib/tenant/config.ts
{
  slug: "nova-igreja",
  churchId: "ch_04",
  name: "Nova Igreja",
  hosts: ["nova-igreja.sua-plataforma.com", "nova-igreja.lvh.me"],
  theme: {
    primary: "#f59e0b", // Laranja
    logo: "/logos/nova.svg",
  },
  seo: {
    title: "Nova Igreja - Bem-vindo",
    description: "Nova Igreja - Uma nova comunidade",
  },
}
```

```typescript
// lib/data/events.ts
ch_04: [
  {
    id: "evt_04_01",
    title: "Culto de Inauguração",
    description: "Primeiro culto da nova igreja",
    date: "2025-12-30",
    time: "19:00",
    location: "Nova Sede",
  },
]
```

### 2. Conectar Banco de Dados

Substitua os mocks por queries reais:

```typescript
// lib/data/events.ts
import { prisma } from "@/lib/prisma";

export async function getEventsByChurchId(churchId: string): Promise<Event[]> {
  return await prisma.event.findMany({
    where: { churchId },
    orderBy: { date: "asc" },
  });
}
```

### 3. Adicionar Autenticação

```bash
npm install next-auth
```

Ver [EXAMPLES.md](EXAMPLES.md#exemplo-15-nextauth-com-tenant) para implementação completa.

### 4. Implementar Upload de Logos

```bash
npm install @vercel/blob
```

Ver [EXAMPLES.md](EXAMPLES.md#exemplo-14-upload-namespaced) para implementação.

## 🐛 Problemas Comuns

### lvh.me não funciona

**Solução:** Use curl com header Host:

```bash
curl -H "Host: igreja-a.sua-plataforma.com" http://localhost:3000
```

### CSS variables não aplicadas

**Verifique:**

1. O layout está aplicando `style={themeStyles}` no `<body>`
2. Componentes usam `var(--primary)` corretamente

### Tenant não encontrado (404)

**Verifique:**

1. Host está mapeado em `lib/tenant/config.ts`
2. Middleware está rodando (veja logs do Next.js)
3. Matcher do middleware inclui a rota

### Build falha

**Verifique:**

1. `npm install` foi executado
2. TypeScript está configurado corretamente
3. Não há erros de sintaxe

## 📚 Documentação Completa

- [README.md](README.md) - Documentação principal
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura detalhada
- [EXAMPLES.md](EXAMPLES.md) - Exemplos de código

## 🎓 Conceitos-Chave

| Conceito | Descrição |
|----------|-----------|
| **Tenant** | Uma "igreja" na plataforma (ex: Igreja A) |
| **Host** | Domínio usado para acessar (ex: igreja-a.sua-plataforma.com) |
| **Middleware** | Detecta tenant pelo host (Edge Runtime) |
| **Server Component** | Componente React que roda no servidor |
| **ISR** | Incremental Static Regeneration (cache com revalidação) |
| **CSS Variables** | `--primary`, `--secondary` aplicadas por tenant |

## 💡 Dicas

### Debug do Tenant

```typescript
// Em qualquer Server Component
const tenant = await getCurrentTenant();
console.log("Tenant atual:", tenant);
```

### Ver Headers Injetados

```bash
curl -v -H "Host: igreja-a.sua-plataforma.com" http://localhost:3000 2>&1 | grep X-Tenant
```

### Limpar Cache do Next.js

```bash
rm -rf .next
npm run dev
```

### Ver Build Output

```bash
npm run build 2>&1 | grep -A 20 "Route (app)"
```

## ⚡ Performance

- **Middleware**: <50ms (Edge)
- **ISR Cache**: Serve em <100ms
- **First Load**: ~500ms
- **Subsequent**: ~50ms (cache)

## 🔥 Features da PoC

- ✅ Multi-tenant por subdomínio
- ✅ Domínios customizados
- ✅ Tema dinâmico (cores, logo)
- ✅ SEO por tenant
- ✅ Dados isolados
- ✅ ISR com cache por tenant
- ✅ API Routes com tenant
- ✅ Sitemap/Robots dinâmicos
- ✅ Deploy na Vercel

## 🚫 O Que Não Tem (Propositalmente)

- ❌ Banco de dados (usa mocks)
- ❌ Autenticação
- ❌ Testes automatizados
- ❌ Docker
- ❌ CI/CD
- ❌ Monitoramento

Esta é uma **PoC enxuta** para validar a arquitetura multi-tenant. Para produção, adicione os itens acima conforme necessário.

---

**Pronto para começar?** Execute `npm run dev` e acesse [http://igreja-a.lvh.me:3000](http://igreja-a.lvh.me:3000) 🚀
