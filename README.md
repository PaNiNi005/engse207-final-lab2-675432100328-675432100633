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

**Repository:** `https://github.com/PaNiNi005/engse207-final-lab2-675432100328-675432100633/tree/main`

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
* docker compose up --build

---

## 6. API Summary (Updated)
   
* Auth Service:

POST /api/auth/register - สมัครสมาชิก

POST /api/auth/login - เข้าสู่ระบบ

GET /api/auth/me - ตรวจสอบข้อมูลผู้ใช้จาก Token


* Task Service:

POST /api/tasks - สร้างงาน

GET /api/tasks - ดูรายการงาน


* User Service:

GET /api/users/me - ดูโปรไฟล์ของตนเอง

PUT /api/users/me - แก้ไขโปรไฟล์

GET /api/users - ดูรายชื่อผู้ใช้ทั้งหมด (Admin Only)

---

## 7. ปัญหาที่พบและแนวทางแก้ไข

1. Database Connectivity: ปัญหาการเชื่อมต่อระหว่าง Container บน Railway

* แก้ไข: ใช้การอ้างอิงผ่าน DATABASE_URL โดยตั้งค่าผ่าน Railway Variable ตามชื่อ Service ของ Database

2. Profile Initialization: การสร้างโปรไฟล์อัตโนมัติเมื่อ login ครั้งแรก

* แก้ไข: ปรับ Logic ใน User Service หาก GET /api/users/me แล้วไม่พบ record ให้สร้าง user_profiles เริ่มต้นโดยดึงข้อมูลจาก JWT Payload

3. CORS Policy: เบราว์เซอร์บล็อกการเรียก API ข้าม Domain

* แก้ไข: ตั้งค่า CORS ในระดับ Application ของทุก Service ให้รองรับ Domain ของ Frontend บน Railway

---

## 8. ภาคผนวกและเอกสารประกอบ

* TEAM_SPLIT.md: รายละเอียดการแบ่งงานของสมาชิก

* INDIVIDUAL_REPORT_[studentid].md: รายงานรายบุคคล

* Screenshots: ดูหลักฐานการทำงานบน Cloud ได้ที่โฟลเดอร์ /screenshots

---
