# 🏗️ نظام متابعة عروض المقاولات

تطبيق ويب **متعدد المستخدمين** لتتبع عروض المقاولات والمشاريع.  
كل مستخدم يشوف كل المشاريع لكن **يعدل فقط على إدخالاته**.  
تدعم **العربية والإنجليزية**، مع تصميم عصري عقاري (كحلي غامق + ذهبي).

**الرابط المباشر:** https://n911t.github.io/musicx/

---

## 📋 المحتويات

1. [الفكرة العامة](#-الفكرة-العامة)
2. [المتطلبات الأساسية](#-المتطلبات-الأساسية)
3. [تحميل وتجهيز المشروع](#-تحميل-وتجهيز-المشروع)
4. [إنشاء Supabase (قاعدة البيانات)](#-إنشاء-supabase-قاعدة-البيانات)
5. [ربط المشروع مع Supabase](#-ربط-المشروع-مع-supabase)
6. [إنشاء مستودع GitHub](#-إنشاء-مستودع-github)
7. [رفع الكود إلى GitHub](#-رفع-الكود-إلى-github)
8. [تفعيل GitHub Pages والنشر التلقائي](#-تفعيل-github-pages-والنشر-التلقائي)
9. [إضافة مستخدمين جدد](#-إضافة-مستخدمين-جدد)
10. [كيفية الاستخدام](#-كيفية-الاستخدام)

---

## 🧠 الفكرة العامة

- موقع يُعرض على الإنترنت
- أي شخص يسجل دخول (email + password) يشوف **كل المشاريع**
- كل مستخدم **يضيف مشاريع جديدة**
- كل مستخدم **يعدل ويحذف فقط مشاريعه هو**
- المشاريع اللي سوها غيرك تظهر **قراءة فقط** (ما تقدر تغيرها)
- اسم المستخدم يظهر بجانب كل مشروع في عمود "بواسطة"
- النظام يحسب صلاحية العروض ويعلمك إذا قربت تنتهي أو انتهت

---

## 💻 المتطلبات الأساسية

### 1. حسابات لازم تسويها (مجاناً)

| الموقع | الرابط | الشرح |
|--------|--------|-------|
| GitHub | https://github.com/signup | عشان ترفع الكود وتستضيف الموقع |
| Supabase | https://supabase.com/dashboard/sign-up | عشان قاعدة البيانات والمستخدمين |

### 2. برامج لازم تنزلها على جهازك

#### ✅ Node.js
- رابط التحميل: https://nodejs.org/
- حمل **الإصدار LTS** (اللي على اليسار)
- افتح الملف المحمل واضغط Next → Next → Install
- **للتحقق:** افتح PowerShell (`Win + R` → اكتب `powershell` → Enter) واكتب:
  ```
  node -v
  ```
  إذا ظهر رقم (مثلاً `v22.x.x`) معناه تم التثبيت بنجاح

#### ✅ Git (اختياري - للرفع المباشر)
- رابط التحميل: https://git-scm.com/download/win
- حمله وشغله واضغط Next → Next → Install
- **للتحقق:** في PowerShell اكتب:
  ```
  git --version
  ```

#### ✅ GitHub Desktop (اختياري والأسهل للمبتدئين)
- رابط التحميل: https://desktop.github.com/
- سهل جداً، ما تحتاج أوامر

---

## 📦 تحميل وتجهيز المشروع

### الخطوة 1: حمل الملفات
احصل على مجلد المشروع كاملًا (من صديقك أو من GitHub).

### الخطوة 2: شغل PowerShell في مجلد المشروع
- افتح مجلد `مشروع اكسل`
- اضغط كليك يمين على مساحة فارغة → **Open in Terminal** أو **PowerShell**
- أو: اكتب `powershell` في شريط العنوان واضغط Enter

### الخطوة 3: ثبت الاعتماديات
في PowerShell اكتب:
```
npm install
```

خلاص - المشروع جاهز للتعديل.

---

## 🗄️ إنشاء Supabase (قاعدة البيانات)

### الخطوة 1: سجل في Supabase
- روح https://supabase.com/dashboard/sign-up
- سجل بحساب GitHub (الأسهل)

### الخطوة 2: أنشئ مشروع جديد
1. بعد الدخول، اضغط **New project**
2. **Name:** اكتب اسم (مثلاً `contracting-tracker`)
3. **Database Password:** اكتب كلمة سر قوية واحفظها (مهم!)
4. **Region:** اختر **Singapore (ap-southeast-1)** أو **Japan (ap-northeast-1)** (الأقرب للشرق الأوسط)
5. **Pricing Plan:** اختر **Free**
6. اضغط **Create new project**
7. **انتظر 1-2 دقائق** لحين الانتهاء

### الخطوة 3: شغل ملفات SQL
1. من الشريط الجانبي الأيسر اضغط **SQL Editor**
2. اضغط **New Query** أو **+**
3. **افتح ملف** `supabase/migrations/001_init.sql` بنوت باد أو أي محرر نصوص
4. انسخ كل النص والصقه في SQL Editor
5. اضغط **Run** (أو `Ctrl + Enter`)
6. **كرر العملية** مع `supabase/migrations/002_multi_user.sql` (نفس الطريقة)

> ✅ **تأكد:** بعد كل أمر شغّل، يظهر **Success** في أسفل الصفحة

### الخطوة 4: جيب رابط ومفاتيح API
1. الشريط الجانبي ← **Project Settings** (🔧 أيقونة)
2. تحت **Project Configuration** ← **API**
3. بتشوف هالمعلومات (انسخهم بمفكرة):
   - **Project URL** (شيء زي `https://xxxxx.supabase.co`)
   - **anon public** (مفتاح طويل)
4. لا تعطي هذه المفاتيح لأحد غير صديقك المطور

---

## 🔗 ربط المشروع مع Supabase

### في مجلد المشروع
1. افتح ملف `.env.example` بنوت باد
2. بتشوف:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. **أنشئ ملف جديد** باسم `.env` في نفس المجلد
4. الصق المحتوى واستبدل القيم بالمفاتيح اللي نسختها من Supabase

مثال ما يصير (بس للتوضيح):
```
VITE_SUPABASE_URL=https://grjjaqhqcpnoofywwbao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ ملف `.env` هذا **مهم جداً** وبدونه ما يشتغل الموقع.  
> لا ترسله لأحد ولا ترفعه على GitHub (مخفي تلقائيًا بفضل `.gitignore`).

### تجربة التشغيل المحلي
في PowerShell اكتب:
```
npm run dev
```
بتظهر رسالة فيها رابط مثل `http://localhost:5173`.  
افتحه في المتصفح. إذا ظهرت صفحة تسجيل الدخول → **ألف مبروك!** الموقع شغال.

---

## 📁 إنشاء مستودع GitHub

### طريقة 1: من موقع GitHub (يدوي)
1. روح https://github.com/new
2. **Repository name:** اكتب `musicx` (أي اسم تحب)
3. **Public** (خلها عامة عشان GitHub Pages)
4. **لا** تختار Initialize with README (لأن عندك ملفات)
5. اضغط **Create repository**

### طريقة 2: من GitHub Desktop (أسهل للمبتدئين)
1. افتح GitHub Desktop
2. File → New Repository
3. Name: `musicx`
4. Local Path: اختار مجلد (مثل سطح المكتب)
5. Create → بعدين Publich Repository

---

## 📤 رفع الكود إلى GitHub

### طريقة 1: GitHub Desktop (موصى به للمبتدئين)
1. GitHub Desktop → File → Clone Repository
2. اختار `n911t/musicx` (أو مستودعك)
3. اختار مكان التحميل
4. **انسخ كل الملفات** من مجلد `مشروع اكسل` إلى مجلد `musicx` (اللي GitHub Desktop أنشأه)
5. **رجّع إلى GitHub Desktop**:
   - راح يشوف كل الملفات الجديدة
   - في الأسفل اكتب **Summary**: `deploy contract tracker`
   - اضغط **Commit to main**
6. اضغط **Push origin**

### طريقة 2: أوامر PowerShell (إذا عندك Git)
```
cd "E:\مشروع اكسل"

git init
git add -A
git commit -m "deploy contract tracker"

# غير الرابط برابط مستودعك
git remote add origin https://github.com/اسمك/musicx.git
git branch -M main
git push -u origin main
```

---

## 🚀 تفعيل GitHub Pages والنشر التلقائي

### الخطوة 1: ضبط GitHub Pages
1. روح إلى مستودعك على GitHub (https://github.com/اسمك/musicx)
2. اضغط على **Settings** (التاب علوي)
3. الشريط الجانبي ← **Pages** (تحت Code and automation)
4. في **Source** اختار **GitHub Actions**

### الخطوة 2: إضافة أسرار Supabase (secrets)
1. من مستودعك على GitHub ← **Settings** ← **Secrets and variables** ← **Actions**
2. اضغط **New repository secret**
3. أضف اثنين:

#### أول سر
- **Name:** `VITE_SUPABASE_URL`
- **Secret:** (حط رابط مشروع Supabase اللي نسخته)

#### ثاني سر
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Secret:** (حط المفتاح العام)

### الخطوة 3: ضبط اسم المستودع في الملفات
افتح `vite.config.ts` وغير `base: './'` إلى `base: '/اسم-مستودعك/'`.  
مثال: إذا اسم مستودعك `musicx` فخليها:
```ts
base: '/musicx/',
```

> لو تبي الموقع يفتح على https://اسمك.github.io (بدون مسار فرعي)،  
> **يجب** يكون اسم المستودع `اسمك.github.io`  
> وتخلي `base: '/'`

### الخطوة 4: النشر التلقائي
كل ما تسوي **commit + push** إلى `main`:
- GitHub Actions يتشغل تلقائيًا
- يبني الموقع
- ينشره على GitHub Pages
- استغرق **1-2 دقائق**

بعدها روح إلى:
```
https://اسمك.github.io/musicx/
```
(أو الرابط اللي يظهر في Settings → Pages)

### الخطوة 5: تحقق من النشر
- افتح الرابط في المتصفح
- إذا ظهرت صفحة تسجيل الدخول → ✅ **نجاح!**
- إذا ظهر خطأ 404 → ارجع وتأكد من `base` في `vite.config.ts`
- إذا ظهر خطأ أبيض (فاضي) → افتح Console (`F12`) وتأكد إن مفاتيح Supabase صحيحة في GitHub Secrets

---

## 👥 إضافة مستخدمين جدد

1. روح https://supabase.com/dashboard/project/grjjaqhqcpnoofywwbao
2. (إذا سويت Supabase جديد، روح لمشروعك بدل `grjjaqhqcpnoofywwbao`)
3. الشريط الجانبي ← **Authentication** → **Users**
4. اضغط **Add User** → **Create user**
5. اكتب:
   - **Email:** (مثال: `ahmed@gmail.com`)
   - **Password:** (أقترح كلمة قوية، مثل `A@12345678a` مع حرف كبير ورمز ورقم)
6. **حذاري:** لا تشيل علامة ✅ من **Auto Confirm User**
7. اضغط **Create User**

المستخدم الجديد يدخل على https://اسمك.github.io/musicx/ بالإيميل والباسوورد اللي خليتها.

---

## 🎯 كيفية الاستخدام

### أول دخول
- افتح الموقع
- سجل دخول بالإيميل والباسوورد (أنت من أضفته في Supabase)
- بتشوف جدول فاضي
- اضغط **إضافة سطر** (الزر الأزرق فوق)
- ابدأ املأ البيانات (كل خانة تضغط عليها تكتب)
- **حفظ تلقائي** - ما في زر حفظ، كل ما تكتب ينحفظ مباشرة

### صلاحيات المستخدمين
| الإجراء | مشروعك | مشروع غيرك |
|---------|--------|------------|
| مشاهدة | ✅ | ✅ |
| إضافة | ✅ | ❌ |
| تعديل | ✅ | ❌ (قراءة فقط) |
| حذف | ✅ (مستقبلاً) | ❌ |
| ملاحظات | ✅ | ❌ (عرض فقط) |

### الألوان اللي راح تشوفها
- **أخضر:** الموافقة، ساري المفعول، فيه ملاحظات
- **أحمر:** مرفوض، منتهي، ما فيه ملاحظات
- **أصفر/برتقالي:** قيد الدراسة، العرض قرب ينتهي
- **كحلي غامق:** الشريط العلوي

### إشعارات انتهاء الصلاحية
- أي عرض باقي له **أقل من 15 يوم** يظهر باللون الأصفر
- أي عرض **انتهى** يظهر باللون الأحمر
- فيه شريط إعلاني فوق الجدول وبانل الإشعارات (الجرس)

---

## 📁 هيكل المجلدات (للمطورين)
```
مشروع اكسل/
├── .env                         # مفاتيح Supabase (ما ترفع)
├── .env.example                 # نموذج للمفاتيح
├── .github/workflows/deploy.yml # نشر تلقائي على GitHub Pages
├── index.html                   # الصفحة الرئيسية
├── package.json                 # تعريفات المشروع والاعتماديات
├── vite.config.ts               # إعدادات Vite
├── tsconfig.json                # إعدادات TypeScript
├── public/
│   ├── favicon.svg              # أيقونة الموقع
│   └── icons.svg                # أيقونات PWA
├── src/
│   ├── main.tsx                 # نقطة البداية
│   ├── App.tsx                  # توجيه الصفحات (Login → Dashboard)
│   ├── index.css                # أنماط Tailwind
│   ├── lib/
│   │   ├── supabase.ts          # اتصال Supabase
│   │   ├── useProjects.ts       # جلب وتحديث المشاريع
│   │   ├── types.ts             # تعريفات البيانات
│   │   └── expiry.ts           # حساب تاريخ الصلاحية
│   ├── pages/
│   │   ├── LoginPage.tsx        # صفحة تسجيل الدخول
│   │   └── DashboardPage.tsx    # لوحة التحكم الرئيسية
│   ├── components/
│   │   ├── DataTable.tsx        # جدول المشاريع
│   │   ├── EditableCell.tsx     # خلية قابلة للتعديل
│   │   ├── ExpiryCell.tsx       # شريط صلاحية العرض
│   │   ├── ExpiryBanner.tsx     # إعلان انتهاء الصلاحية
│   │   ├── NotificationPanel.tsx# لوحة الإشعارات
│   │   ├── NoteModal.tsx        # نافذة الملاحظات
│   │   └── LanguageSwitcher.tsx # مفتاح اللغة
│   └── i18n/
│       ├── ar.json              # ترجمة عربية
│       └── en.json              # ترجمة إنجليزية
├── supabase/
│   └── migrations/
│       ├── 001_init.sql         # إنشاء جدول المشاريع
│       └── 002_multi_user.sql   # المستخدمين المتعددين
└── README.md                    # هذا الملف
```

---

## ⚠️ ملاحظات مهمة

### مشاكل وحلول سريعة

| المشكلة | الحل |
|---------|------|
| الموقع أبيض فاضي | افتح Console (`F12`) وتأكد من مفاتيح Supabase في `.env` أو GitHub Secrets |
| خطأ 404 بعد النشر | تأكد من `base: '/اسم-مستودعك/'` في `vite.config.ts` |
| ما يظهر مستخدمين جدد | راجع SQL (شغل `002_multi_user.sql`) وضيف المستخدم من Authentication → Users |
| ما اقدر أعدل على مشروع غيري | هذا **متعمد** - كل مستخدم يعدل فقط على مشاريعه |
| خطأ في تشغيل `npm install` | تأكد من تثبيت Node.js وشوف الإصدار (`node -v` لازم `v18` فأعلى) |
| ما أتذكر كلمة سر Supabase | روح Project Settings → Database → Reset database password |
| نبغى نغير اسم المستودع من `musicx` | غير `base` في `vite.config.ts` وأعد Commit + Push |

### أمان
- **ما ترفع ملف `.env`** (Gitignore يمنع هذا)
- **ما تعطي `anon key` لأحد** ما يحتاج تعطيه لأحد أصلاً
- **كلمة سر قاعدة البيانات** احفظها عندك
- **إضافة المستخدمين** تكون من Supabase Dashboard فقط

---

## 📞 الدعم الفني
إذا صارت مشكلة:
1. افتح Issues في مستودع GitHub
2. أو اسأل صديقك المطور

---

> **تم التطوير باستخدام:** React 19 + Vite 8 + TypeScript + Tailwind CSS 4 + TanStack Table + Supabase
