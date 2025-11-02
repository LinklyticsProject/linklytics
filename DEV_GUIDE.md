# 🛠️ Development Guide สำหรับ Microservices

## 📋 แนวทางในการพัฒนา Microservices

มี 3 แนวทางหลักที่ใช้กันในการ dev microservices:

---

## 🎯 แนวทางที่ 1: **Local Development (แนะนำสำหรับ Dev ตัวต่อตัว)**

**วิธีการ:**

- รัน Frontend และ Backend **โดยตรงบนเครื่อง** (ไม่ใช้ Docker)
- **Database รันใน Docker** (เพราะติดตั้งง่าย ไม่ต้อง setup ซับซ้อน)

### ✅ ข้อดี:

- **Hot Reload เร็วที่สุด** - TypeScript compiler และ Next.js dev server รันเร็ว
- **Debug ง่าย** - ใช้ VS Code debugger โดยตรง
- **ไม่ต้อง rebuild Docker image** เมื่อเปลี่ยน dependencies
- **Performance ดีกว่า** - ไม่มี overhead ของ Docker volumes

### ❌ ข้อเสีย:

- ต้อง install Node.js และ dependencies บนเครื่อง
- แต่ละ developer ต้อง setup environment เอง

### 🚀 วิธีรัน:

```bash
# Terminal 1: รัน PostgreSQL ใน Docker
docker-compose -f docker-compose.dev.yml up postgres -d

# Terminal 2: รัน Auth Service (Backend)
cd apps/auth-service
pnpm run start:dev

# Terminal 3: รัน Web Service (Frontend)
cd apps/web-service
pnpm run dev
```

**Connection:**

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`
- Database: `localhost:5432`

---

## 🐳 แนวทางที่ 2: **Docker Compose (แนะนำสำหรับ Integration Testing)**

**วิธีการ:**

- รัน **ทุกอย่างใน Docker** (Frontend, Backend, Database)
- ใช้ volumes เพื่อ hot reload

### ✅ ข้อดี:

- **Environment เหมือนกันทุกคน** - เหมาะสำหรับทีม
- **Test Integration** - ทดสอบการทำงานร่วมกันของ services
- **ไม่ต้อง install dependencies บนเครื่อง**

### ❌ ข้อเสีย:

- Hot reload **ช้ากว่า** เพราะต้อง sync files ผ่าน Docker volumes
- Debug ยากกว่า (ต้อง setup remote debugging)
- ใช้ resource มากกว่า

### 🚀 วิธีรัน:

```bash
# Start ทุก services พร้อมกัน
docker-compose -f docker-compose.dev.yml up --build

# หรือรันใน background
docker-compose -f docker-compose.dev.yml up -d
```

---

## 🔀 แนวทางที่ 3: **Hybrid Approach (แนะนำสำหรับทีมใหญ่)**

**วิธีการ:**

- **Services ที่ต้องการ hot reload เร็ว** → รัน Local (Frontend, Backend)
- **Infrastructure services** → รันใน Docker (Database, Redis, Message Queue)

### ✅ ข้อดี:

- **ได้ความเร็วของ Local + ความสะดวกของ Docker**
- ยืดหยุ่น - แต่ละคนเลือกได้ว่ารันอะไรใน Docker

### 🚀 วิธีรัน:

```bash
# Terminal 1: รันเฉพาะ Database
docker-compose -f docker-compose.dev.yml up postgres -d

# Terminal 2: รัน Auth Service Local
cd apps/auth-service
pnpm run start:dev

# Terminal 3: รัน Web Service Local
cd apps/web-service
pnpm run dev
```

---

## 💡 คำแนะนำสำหรับโปรเจคนี้

### สำหรับ Developer คนเดียว:

👉 **ใช้แนวทางที่ 1 (Local Development)**

```bash
# 1. Start PostgreSQL
docker-compose -f docker-compose.dev.yml up postgres -d

# 2. รัน Backend (Terminal ใหม่)
cd apps/auth-service && pnpm run start:dev

# 3. รัน Frontend (Terminal ใหม่)
cd apps/web-service && pnpm run dev
```

### สำหรับทีม:

👉 **ใช้แนวทางที่ 3 (Hybrid)**

- Database รัน Docker (สะดวก setup)
- Services รัน Local (เร็ว)

---

## 🔧 Setup Database Connection

เมื่อรัน Database ใน Docker แต่ service รัน Local:

### Auth Service (.env)

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=linkytics
DATABASE_PASSWORD=linkytics_dev_password
DATABASE_NAME=auth_db
```

### Web Service (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📝 Environment Variables

### Development Database (Docker)

- **Host**: `localhost` (จาก host) หรือ `postgres` (จากใน Docker)
- **Port**: `5432`
- **User**: `linkytics`
- **Password**: `linkytics_dev_password`
- **Database**: `auth_db`

---

## 🎬 Quick Start Scripts

### รันด้วย Helper Scripts:

```bash
# 1. Install dependencies (ครั้งแรก)
pnpm install

# 2. Start Database
pnpm run dev:db

# 3. รันทั้ง Frontend และ Backend พร้อมกัน
pnpm run dev

# หรือรันแยกกัน:
pnpm run dev:auth    # รันแค่ Backend
pnpm run dev:web     # รันแค่ Frontend
```

### Docker Commands:

```bash
# รันทุกอย่างใน Docker
pnpm run dev:docker

# หยุด services
pnpm run dev:docker:down

# หยุดแค่ Database
pnpm run dev:db:stop
```
