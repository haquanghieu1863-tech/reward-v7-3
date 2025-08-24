# Reward Web — ALL-IN-ONE Final
Tất cả trong 1: Frontend + Backend API (Vercel Functions) + Prisma + Admin UI + Page Builder đa trang + Anti-skip + Countdown tròn + Pháo hoa + SFX + Bonus + Admin Users.

## Chạy local
```bash
npm install
npm run dev
```
Muốn dùng DB local nhanh, đổi prisma sang sqlite (comment sẵn trong `schema.prisma`) và tạo `.env` từ `.env.example`.

## Migrate DB (khi dùng Postgres/SQLite)
```bash
npx prisma migrate dev -n init
npx prisma generate
```

## Deploy Vercel
- Framework: **Vite**
- Build: `npm run build`
- Output: `dist`
- ENV: `DATABASE_URL`, `JWT_SECRET`, `APP_URL` (+ tuỳ chọn `RESEND_API_KEY`, `FROM_EMAIL`)

## Admin
- **admin-settings**: cấu hình site, banner, ads, countdown, requiredWatchSec, bonus, sfx (Import/Export JSON).
- **admin-page-builder**: chỉnh các trang `home/tasks/leaderboard/faq/withdraw`. Blocks: Hero, Text, AdsList, ButtonRow, Spacer, TableBlock, QnABlock, TaskListBlock, **CustomLinksBlock**, **GameEmbedBlock**.
- **admin-users**: xem người dùng, cộng/trừ/đặt điểm, đổi role, xem lịch sử giao dịch.
