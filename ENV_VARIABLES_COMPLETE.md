# 🔐 متغيرات البيئة الكاملة - نظام حور

## 📋 **جميع متغيرات البيئة المطلوبة**

### ✅ **Frontend Variables (VITE_*)**
```bash
# Google Services
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# إعدادات التطبيق
VITE_APP_NAME=SmartStartAI
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_API_BASE_URL=https://www.smartstart-ai.net
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_VOICE=true

# Supabase (إن كان مستخدماً)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ✅ **Backend Variables (Netlify Functions)**
```bash
# OpenAI API (إلزامي)
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# نماذج OpenAI
CHAT_MODEL=gpt-4o-mini
TTS_MODEL=tts-1
STT_MODEL=whisper-1
TTS_VOICE=alloy

# أمان Backend
ALLOWED_ORIGIN=https://www.smartstart-ai.net
CORS_CREDENTIALS=true

# حدود التكلفة والأداء
MAX_TOKENS_PER_REQ=12000
DAILY_BUDGET_USD=30
MAX_TTS_SECONDS_PER_SESSION=45
MAX_STT_SECONDS_PER_SESSION=120
RATE_LIMIT_RPM=15

# إعدادات الأمان والخصوصية
PDPL_SAFE_MODE_DEFAULT=true
SANITIZE_OUTPUTS=true
AUDIT_LOGGING=true
DATA_RETENTION_DAYS=90
```

### ✅ **Database Variables (Docker)**
```bash
# PostgreSQL
POSTGRES_DB=smartstart_db
POSTGRES_USER=smartstart_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Database URL
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
```

### ✅ **Docker Environment**
```bash
# Docker Compose
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-secret-key-here-change-in-production
JWT_SECRET=your-jwt-secret-here-change-in-production

# Ports
DOCKER_POSTGRES_PORT=5432
DOCKER_REDIS_PORT=6379
DOCKER_APP_PORT=8000
```

---

## 📁 **إنشاء ملفات البيئة**

### **1. إنشاء .env.example:**
```bash
# انسخ محتوى المتغيرات أعلاه إلى .env.example
# غيّر القيم الحساسة إلى placeholders
```

### **2. إنشاء .env.production:**
```bash
# للإنتاج - قيم فعلية
VITE_GOOGLE_MAPS_API_KEY=AIzaSy_your_real_key
VITE_GA_MEASUREMENT_ID=G-YOUR_REAL_ID
ALLOWED_ORIGIN=https://www.smartstart-ai.net
OPENAI_API_KEY=sk-proj-your_real_key
```

### **3. إنشاء .env.local (للتطوير):**
```bash
# للتطوير المحلي
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:8888
ALLOWED_ORIGIN=http://localhost:3000
DEBUG=true
```

---

## 🐳 **تحديث docker-compose.yml**

```yaml
# إضافة متغيرات البيئة المطلوبة
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-smartstart_db}
      POSTGRES_USER: ${POSTGRES_USER:-smartstart_user}  
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secure_password}
    ports:
      - "${DOCKER_POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD:-redis_password}
    ports:
      - "${DOCKER_REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-smartstart_user}:${POSTGRES_PASSWORD:-secure_password}@postgres:5432/${POSTGRES_DB:-smartstart_db}
      - REDIS_URL=redis://:${REDIS_PASSWORD:-redis_password}@redis:6379
      - ENVIRONMENT=${ENVIRONMENT:-development}
      - DEBUG=${DEBUG:-true}
      - SECRET_KEY=${SECRET_KEY:-dev-secret-key}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ALLOWED_ORIGIN=${ALLOWED_ORIGIN:-http://localhost:3000}
    ports:
      - "${DOCKER_APP_PORT:-8000}:8000"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - backend_uploads:/app/uploads

volumes:
  postgres_data:
  redis_data:
  backend_uploads:
```
