# 💸 Spend-sible — A Personal AI-Powered Finance Dashboard 
Vercel Link- https://spend-sible.vercel.app/

A full-stack personal finance management dashboard built using **Next.js 14**, **Prisma**, **Shadcn**, **TailwindCSS**, and **Clerk**, designed to help users track and manage their finances with ease.

---

## Features

- ✅ **Authentication** via Clerk
- ✅ **Add, edit & delete transactions** (income/expense)
- ✅ **Create and manage accounts**
- ✅ **Default account toggling**
- ✅ **Real-time balance updates**
- ✅ **Form validation** using Zod
- ✅ **Drawer UI components**
- ✅ **Server actions** for data mutations
- ✅ **Responsive design** with Tailwind
- ✅ **Toasts and error handling** with Sonner
- ✅ **Dynamic routing** & clean URL structure
- ✅ **Form state handling** with React Hook Form
- ✅ **Uses custom hook `useFetch()`** for client-side data mutation
- ✅ **Secure database access** using Prisma with Clerk user mapping

---

## 🛠️ Tech Stack

| Category       | Tech Used                      |
|----------------|--------------------------------|
| **Frontend**   | Next.js App Router, TailwindCSS|
| **Backend**    | Server Actions, Prisma ORM     |
| **Auth**       | Clerk                          |
| **Database**   | PostgreSQL (via Supabase)      |
| **Form Utils** | Zod, React Hook Form           |
| **UI**         | Shadcn UI, Lucide Icons        |
| **Notifications** | Sonner                    |

---

## 🔒 Models (Prisma)

- **User**
- **Account**
- **Transaction**
---

Updates planned:
- [ ] **Recurring transactions**
- [ ] **Budget limits and alerts**
- [ ] **Pagination for transaction history**
- [ ] **Visual insights (Pie/Bar charts)**
- [ ] **Rate limiting for spam protection**
