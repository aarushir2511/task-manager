# TaskFlow — Full Stack Task Management App

TaskFlow is a modern full-stack task management application that allows users to register, log in, and manage their daily tasks efficiently with a clean and responsive UI.

---

##  Features

###  Authentication
- User Registration
- User Login (JWT-based authentication)
- Secure routes with token validation

###  Task Management
- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed / pending
- Search and filter tasks

###  UI/UX
- Responsive design (mobile + desktop)
- Modern lavender-themed dashboard
- Toast notifications for actions
- Password strength indicator (Weak / Medium / Strong)

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Sonner (toast notifications)

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

---
# 📝 Task Manager App

A full-stack Task Manager application with authentication, task CRUD operations, search/filtering, and a responsive UI built using **Next.js**, **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.

---

##  Setup Instructions

###  Clone the repository

```bash
git clone <your-repo-url>
```
```bash
cd task-manager
cd backend
```
```bash
npm install
```
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
JWT_SECRET="your_secret_key"
```
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```
