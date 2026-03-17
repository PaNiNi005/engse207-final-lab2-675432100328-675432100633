# ENGSE207 Software Architecture Final Lab Set 2

## ข้อมูลผู้จัดทำ (กลุ่ม S1-5)
1. นางสาว รัฐจิกาลณ์ กวงคำ (รหัสนักศึกษา: 67543210063-3)
2. นาย ธนมินทร์ เปลี่ยนพร้อม (รหัสนักศึกษา: 67543210032-8)

**Repository:** `https://github.com/PaNiNi005/engse207-final-lab2-675432100328-675432100633/tree/main`

---

## Cloud Service URLs (Railway)
| Service | Public URL (Production) |
| :--- | :--- |
| Auth Service | [ระบุ URL ของ Auth Service บน Railway ที่นี่] |
| Task Service | [ระบุ URL ของ Task Service บน Railway ที่นี่] |
| User Service | [ระบุ URL ของ User Service บน Railway ที่นี่] |

---

## การต่อยอดจาก Set 1 สู่ Set 2
ในโปรเจกต์ Set 2 นี้ เป็นการพัฒนาระบบต่อยอดจาก Set 1 โดยเปลี่ยนสถาปัตยกรรมจากรูปแบบเดิมให้มีความเป็น Microservices ที่สมบูรณ์ยิ่งขึ้น ดังนี้:
1. การขยาย Service: เพิ่ม User Service เพื่อจัดการข้อมูลโปรไฟล์ และเพิ่มระบบ Register API ใน Auth Service (ซึ่งใน Set 1 ไม่มี)
2. รูปแบบฐานข้อมูล: เปลี่ยนจากฐานข้อมูลที่ใช้ร่วมกัน (Shared Database) มาเป็นรูปแบบ Database-per-Service โดยแยกฐานข้อมูล 3 ชุดอิสระต่อกัน
3. ระบบ Cloud: ย้ายการ Deploy จากการรันผ่าน Docker ในเครื่อง Local ขึ้นสู่ระบบ Cloud จริงบน Railway Platform
4. การจัดการ Logging: เปลี่ยนจาก Log Service ส่วนกลาง มาเป็นการเขียน Log ลงในฐานข้อมูลของแต่ละ Service โดยตรง เพื่อลดความซับซ้อนของการสื่อสารข้าม Network บน Cloud

---

### Architecture Diagram (Cloud Version)

สถาปัตยกรรมระบบบน Railway ประกอบด้วย 3 Services และ 3 Databases ที่ทำงานแยกกันอิสระ:

<img width="903" height="622" alt="image" src="https://github.com/user-attachments/assets/3448d795-39bf-4b6b-af8e-cd75b58fab2d" />

---

## Gateway Strategy
กลุ่มของเราเลือกใช้ **Option A: Frontend Direct Call (Client-side Gateway)**
**เหตุผล:** เนื่องจากแต่ละ Service บน Railway มีการจัดการ HTTPS และมอบหมาย Public URL ให้โดยเฉพาะอยู่แล้ว การให้ Frontend เรียกใช้แต่ละ Service โดยตรงผ่านไฟล์ config.js จึงเป็นวิธีที่ตั้งค่าง่ายที่สุดสำหรับการส่งงานสอบ ลดความซับซ้อนในการจัดการ Proxy และช่วยลดความหน่วง (Latency) ในการเรียกใช้ API

---

## วิธีการรัน Local ด้วย Docker Compose
หากต้องการทดสอบระบบในสภาพแวดล้อม Local ให้ดำเนินการดังนี้:

1. Clone Repository นี้ลงเครื่อง
2. ตรวจสอบไฟล์ `.env` โดยอ้างอิงจาก `.env.example` และตรวจสอบว่าค่า `JWT_SECRET` ตรงกันทุก Service
3. ใช้คำสั่งเพื่อเริ่มต้นการทำงาน:
* docker-compose up --build

---

### ระบบจะเปิด Port ดังนี้:

- Auth Service: 3001
- Task Service: 3002
- User Service: 3003

---

### Environment Variables ที่ใช้
การตั้งค่าที่สำคัญในทุก Service ทั้งบน Railway และ Local:

- **DATABASE_URL**: URL สำหรับเชื่อมต่อฐานข้อมูล PostgreSQL ของแต่ละ Service
- **JWT_SECRET**: รหัสลับสำหรับการตรวจสอบ Token (ต้องกำหนดให้ตรงกันทุก Service)
- **PORT**: พอร์ตที่ Service รัน (เช่น 3001, 3002, 3003)
- **NODE_ENV**: กำหนดสถานะเป็น production เมื่อรันบน Cloud
  
---

### วิธีการทดสอบด้วย curl (Cloud URLs)
*กรุณาเปลี่ยน [URL] เป็น URL จริงจากระบบ Railway ของกลุ่ม*

**1. ทดสอบการสมัครสมาชิก (Register):**
```bash
curl -X POST [AUTH_URL]/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"clouduser","email":"cloud@test.com","password":"password123"}'
```

---

### 2. ทดสอบการเข้าสู่ระบบ (Login) เพื่อรับ Token:

```bash
TOKEN=$(curl -s -X POST [AUTH_URL]/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cloud@test.com","password":"password123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "TOKEN: $TOKEN"
