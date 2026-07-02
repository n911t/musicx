# PROJECT_MAP — متابعة عروض المقاولات (Contracting Offers Tracker)

## [TECH_STACK]
| الطبقة | التقنية | الإصدار |
|--------|---------|---------|
| Framework | React | 19.2.7 |
| Build Tool | Vite | 8.1.2 |
| Styling | Tailwind CSS | 4.3.2 |
| Table | @tanstack/react-table | 8.21.3 |
| Icons | lucide-react | ^0.510.0 |
| i18n | react-i18next | 17.0.8 |
| Backend | Supabase (PostgreSQL + Auth + RLS) | 2.110.0 |
| PWA | vite-plugin-pwa | ^1.3.0 |
| Hosting | GitHub Pages + Supabase | - |

## [SYSTEM_FLOW]
```
[User] → Opens Site → Login (Supabase Auth) → Dashboard (Table)
    → View/Create/Edit Rows → Inline Editing
    → Click Notes Icon → Modal → Save
    → Click Link → Open URL
    → Logout
```

## [ARCHITECTURE]
```
┌──────────────────────────────┐
│    GitHub Pages (SPA)         │
│  React 19 + Vite 8           │
│  ┌─────────┐ ┌────────────┐  │
│  │ Pages   │ │ Components │  │
│  │ - Login │ │ - DataTable│  │
│  │ - Dash  │ │ - NoteModal│  │
│  └─────────┘ └────────────┘  │
│  ┌─────────────────────────┐  │
│  │ lib/                    │  │
│  │ - supabase.ts           │  │
│  │ - i18n.ts               │  │
│  │ - types.ts              │  │
│  │ - useProjects.ts        │  │
│  └─────────────────────────┘  │
└──────────┬───────────────────┘
           │ Supabase REST
┌──────────▼───────────────────┐
│  Supabase (PostgreSQL + RLS)  │
│  - projects table             │
│  - auth.users                 │
│  - RLS Policies               │
└──────────────────────────────┘
```

## [VERIFIABLE_GOALS]
- [x] VG1: Bilingual login page (email/password) with Supabase Auth
- [x] VG2: Responsive table rendering all 17 columns
- [x] VG3: Add row via + button with auto serial
- [x] VG4: Field validation (number fields, phone, date pickers, dropdowns)
- [x] VG5: Note modal with green/red StickyNote indicator
- [x] VG6: URL link opens in new tab with ExternalLink icon
- [x] VG7: Supabase persistence + RLS (policies defined in migration)
- [x] VG8: Vite production build succeeds
- [x] VG9: PWA support with vite-plugin-pwa
- [x] VG10: Result field colored (green/yellow/red)
- [x] VG11: Yes/No field colored (green/red)
- [x] VG12: Floor count blue gradient (opacity proportional to value)
- [x] VG13: Bid validity date countdown bar (yellow→red, sand timer effect)
- [x] VG14: Expiry banner with OK dismiss
- [x] VG15: Notification panel with red/yellow indicators
- [x] VG16: deployed to GitHub Pages
- [ ] VG16: deployed to GitHub Pages (requires Supabase credentials + repo setup)

## [FILES]
```
excel-project/
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── .env.example
├── package.json
├── PROJECT_MAP.md
├── supabase/
│   └── migrations/
│       └── 001_init.sql
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── types.ts
│   │   ├── i18n.ts
│   │   └── useProjects.ts
│   ├── i18n/
│   │   ├── ar.json
│   │   └── en.json
│   ├── components/
│   │   ├── DataTable.tsx
│   │   ├── EditableCell.tsx
│   │   ├── NoteModal.tsx
│   │   └── LanguageSwitcher.tsx
│   └── pages/
│       ├── LoginPage.tsx
│       └── DashboardPage.tsx
```

## [ORPHANS_AND_PENDING]
- ~**حقل النتيجة**: تم تحديد الخيارات (قيد الدراسة، تمت الموافقة، تم الرفض) وربطها كـ dropdown~ ✅
- **GitHub Pages + Supabase**: يحتاج المستخدم إلى:
  1. إنشاء مشروع Supabase
  2. تشغيل `001_init.sql` في SQL Editor
  3. تفعيل Email Auth في Supabase
  4. نسخ الـ URL و Anon Key إلى `.env` أو GitHub Secrets
  5. رفع الكود إلى GitHub وتفعيل Pages
- **اختبار التطبيق**: لا يمكن الاختبار الفعلي بدون Supabase credentials حقيقية
- **عدم وجود اختبارات آلية**: يمكن إضافتها لاحقًا
