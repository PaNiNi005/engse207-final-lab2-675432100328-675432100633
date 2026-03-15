# ENGSE207 Software Architecture
## README — Final Lab Set 1: Microservices + HTTPS + Lightweight Logging

เอกสารฉบับนี้ใช้เป็น `README.md` สำหรับ repository ของ Final Lab Set 1

---

## 1. ข้อมูลรายวิชาและสมาชิก

**รายวิชา:** ENGSE207 Software Architecture  
**ชื่องาน:** Final Lab — ชุดที่ 1: Microservices + HTTPS + Lightweight Logging  
**สมาชิกในกลุ่ม:**
* 67543210032-8 นาย ธนมินทร์ เปลี่ยนพร้อม
* 67543210063-3 นางสาว รัฐจิกาลณ์ กวงคำ

**Repository:** `final-lab-set1/`

---

## 2. ภาพรวมของระบบ

Final Lab ชุดที่ 1 เป็นการพัฒนาระบบ Task Board แบบ Microservices โดยเน้นหัวข้อสำคัญดังนี้:
* การทำงานแบบแยก service
* การใช้ Nginx เป็น API Gateway
* การเปิดใช้งาน HTTPS ด้วย Self-Signed Certificate
* การยืนยันตัวตนด้วย JWT
* การจัดเก็บ log แบบ Lightweight Logging ผ่าน Log Service
* การเชื่อมต่อ Frontend กับ Backend ผ่าน HTTPS
* งานชุดนี้ **ไม่มี Register** และใช้เฉพาะ **Seed Users** ที่กำหนดไว้ในฐานข้อมูล

---

## 3. วัตถุประสงค์ของงาน

งานนี้มีจุดมุ่งหมายเพื่อฝึกให้นักศึกษาสามารถ:
* ออกแบบระบบแบบ Microservices ในระดับพื้นฐาน
* ใช้ Nginx เป็น reverse proxy และ TLS termination
* ใช้ JWT สำหรับ authentication ระหว่าง frontend และ backend
* ออกแบบ logging flow ผ่าน REST API และจัดเก็บ log ลงฐานข้อมูล
* ใช้ Docker Compose เพื่อรวมทุก service ให้ทำงานร่วมกันได้

---

## 4. Architecture Overview

```text
      [ Browser / Postman ]
                 │
                 │ HTTPS :443
                 ▼
      [ Nginx (API Gateway) ]
         ├── /api/auth/* → auth-service
         ├── /api/tasks/* → task-service
         ├── /api/logs/* → log-service
         └── /            → frontend
                  │
                  ▼
          [ PostgreSQL (Shared DB) ]
