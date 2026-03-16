# ENGSE207 Software Architecture: Final Lab Set 2
## Microservices Scale-Up + Cloud Deployment

> README สำหรับการส่งงาน **Final Lab Set 2** — การขยายระบบ Microservices, การใช้ Database-per-Service Pattern และการ Deploy บน Railway Cloud

---

## 1. ข้อมูลรายวิชาและสมาชิก

**รายวิชา:** ENGSE207 Software Architecture  
**ชื่องาน:** Final Lab — ชุดที่ 2: Microservices Scale-Up + Cloud Deployment  

**สมาชิกในกลุ่ม**
* **67543210032-8** นาย ธนมินทร์ เปลี่ยนพร้อม
* **67543210063-3** นางสาว รัฐจิกาลณ์ กวงคำ

**Repository:** `https://github.com/PaNiNi005/final-lab-set2`

---

## 2. Cloud Service URLs (Production)
* **Auth Service:** `https://[AUTH_SERVICE_URL]`
* **Task Service:** `https://[TASK_SERVICE_URL]`
* **User Service:** `https://[USER_SERVICE_URL]`
* **Frontend:** `https://[FRONTEND_URL]`

---

## 3. Architecture Overview (Cloud Version)

[Insert Architecture Diagram Here]

* **Database-per-Service:** ระบบแยกฐานข้อมูลอิสระ 3 ชุด (`auth-db`, `task-db`, `user-db`) เพื่อลดการพึ่งพากัน (Loose Coupling)
* **Logical Reference:** ใช้ `user_id` เป็น Logical Reference อ้างอิงระหว่างฐานข้อมูล โดยยึด `users.id` จาก `auth-db` เป็นหลัก
* **Gateway Strategy:** เลือกใช้ **[ระบุ Option เช่น Option A: Frontend Direct Calls]** เนื่องจากเป็นวิธีที่ลดความซับซ้อนในการจัดการ Infrastructure บน Cloud ในขณะที่ยังคงความปลอดภัยผ่าน JWT Validation ในระดับ Service

---

## 4. สิ่งที่พัฒนาเพิ่มเติมจาก Set 1
1. **Register API:** เพิ่มระบบลงทะเบียนผู้ใช้ใหม่ใน `Auth Service`
2. **User Service:** สร้าง Service ใหม่สำหรับจัดการโปรไฟล์ผู้ใช้และข้อมูลส่วนตัว
3. **Database Decoupling:** แยกฐานข้อมูลราย Service ตามข้อกำหนดของ Database-per-Service
4. **Cloud Deployment:** ย้ายระบบขึ้น Railway พร้อมตั้งค่า Environment Variables แยกราย Service
5. **JWT Synchronization:** ใช้ `JWT_SECRET` ค่าเดียวกันทุก Service เพื่อให้ทุก Service ตรวจสอบสิทธิ์ (Verify) ได้อย่างถูกต้อง

---

## 5. การตั้งค่าและการรันระบบ (Local)

### 5.1 สร้าง `.env`
คัดลอกจาก `.env.example` และกำหนดค่าดังนี้:
* `JWT_SECRET`: (ต้องใช้ค่าเดียวกันทุก Service)
* `DATABASE_URL`: (Connection String ของ Postgres)

### 5.2 รันผ่าน Docker Compose
```bash
docker compose up --build

