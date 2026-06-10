# 🎬 ریلز ساز آموزشی

ابزار هوشمند ساخت پرامپت تصویر برای ریلزهای آموزشی — با Claude AI

---

## 🚀 Deploy روی Vercel (5 دقیقه)

### مرحله ۱ — آپلود به GitHub
1. یه repo جدید بساز روی [github.com](https://github.com/new)
2. فایل‌های این پوشه رو آپلود کن (یا با git push بفرست)

### مرحله ۲ — Import در Vercel
1. برو [vercel.com](https://vercel.com) → **Add New Project**
2. Repo رو از GitHub انتخاب کن
3. روی **Deploy** کلیک کن

### مرحله ۳ — اضافه کردن API Key
1. در Vercel → **Settings** → **Environment Variables**
2. یه متغیر جدید بساز:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** کلیدت از [console.anthropic.com](https://console.anthropic.com/)
3. **Save** کن و **Redeploy** بزن

### ✅ تموم!
لینکت رو با دیگران share کن.

---

## 💻 اجرای محلی

```bash
npm install
cp .env.example .env.local
# API key رو توی .env.local بذار
npm run dev
```

بعد برو `http://localhost:3000`

---

## ساختار پروژه

```
reels-generator/
├── app/
│   ├── layout.tsx          # root layout
│   ├── page.tsx            # رابط کاربری اصلی
│   └── api/
│       └── generate-slides/
│           └── route.ts    # API endpoint (Claude)
├── .env.example
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## چطور کار می‌کنه؟

1. **کاربر** موضوع ریلز رو می‌نویسه
2. **Claude API** هوشمندانه ۸ اسلاید با متن و پوز مناسب تولید می‌کنه
3. **کاربر** اسلایدهای موردنظرش رو انتخاب می‌کنه
4. **ابزار** پرامپت‌های آماده برای Midjourney/Leonardo می‌سازه
