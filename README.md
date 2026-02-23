# 🏘️ Jimpitan Ronda - Sistem Pencatatan Iuran Warga

Aplikasi web untuk pencatatan iuran/setoran warga (jimpitan ronda) dengan sistem transaksi kredit-debit seperti layanan perbankan.

## ✨ Fitur

- 🔐 **Autentikasi** - Login dengan JWT token (stateless session)
- 💰 **Manajemen Transaksi** - Catat pemasukan (kredit) dan pengeluaran (debit)
- 📊 **Dashboard** - Ringkasan saldo, total pemasukan/pengeluaran
- 📅 **Laporan Mingguan** - Laporan terkelompok per minggu dengan kalkulasi saldo
- ⚙️ **Pengaturan** - Ubah password dan kelola profil
- 📱 **Responsive** - Tampilan optimal di desktop dan mobile

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Runtime**: Bun
- **UI**: Shadcn UI + Tailwind CSS
- **Database**: SQLite + Prisma 6
- **Authentication**: Custom JWT + bcrypt
- **State Management**: TanStack Query v5
- **Validation**: Zod
- **Forms**: React Hook Form
- **Linter/Formatter**: Biomejs

## 📦 Installation

\`\`\`bash
# Install dependencies
bun install

# Setup database
bun run db:generate
bun run db:push

# Seed database with sample data
bun run db:seed

# Start development server
bun run dev
\`\`\`

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| \`bun run dev\` | Start development server |
| \`bun run build\` | Build for production |
| \`bun run start\` | Start production server |
| \`bun run lint\` | Run Biome linter |
| \`bun run lint:fix\` | Fix linting issues |
| \`bun run format\` | Format code with Biome |
| \`bun run db:generate\` | Generate Prisma client |
| \`bun run db:push\` | Push schema to database |
| \`bun run db:seed\` | Seed database with sample data |

## 🔑 Default Credentials

- **Username**: \`admin\`
- **Password**: \`admin123\`

## 💡 Usage

### Access Application
Navigate to \`http://localhost:3000\` and login with default credentials.

### Dashboard
View saldo saat ini, total pemasukan, total pengeluaran, dan transaksi terbaru.

### Manage Transactions
- Navigate to **Transaksi** page
- Click **Tambah Transaksi** to add new transaction
- Select type: KREDIT (income) or DEBIT (expense)
- Fill in amount, date, and description

### Weekly Reports
- Navigate to **Laporan Mingguan** page
- Select month and year
- View grouped transactions by week

## 📝 License

MIT
