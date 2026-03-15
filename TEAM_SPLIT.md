# TEAM_SPLIT.md

## ข้อมูลกลุ่ม

**กลุ่มที่:** S1-5  
**รายวิชา:** ENGSE207 Software Architecture

## รายชื่อสมาชิก

1. 67543210032-8 นาย ธนมินทร์ เปลี่ยนพร้อม
2. 67543210063-3 นางสาว รัฐจิกาลณ์ กวงคำ

---

## การแบ่งงานหลัก

### สมาชิกคนที่ 1: นาย ธนมินทร์ เปลี่ยนพร้อม

**รับผิดชอบงานหลักดังต่อไปนี้**
* **Infrastructure & Gateway (Part 1, 6):** จัดการ HTTPS Nginx Config, สร้าง Self-Signed Certificate และตั้งค่า Docker Compose รวมทุก Service
* **Database & Seed Data (Part 2):** ออกแบบ Database Schema และจัดการข้อมูล Seed Users (Alice, Bob, Admin)
* **Backend Services (Part 3-5):** พัฒนา Auth Service, Task Service และ Log Service (API Development)
* **Testing & Quality Assurance (Part 9):** จัดทำ Test Cases และทดสอบระบบผ่าน curl commands ตามข้อกำหนด

### สมาชิกคนที่ 2: นางสาว รัฐจิกาลณ์ กวงคำ

**รับผิดชอบงานหลักดังต่อไปนี้**
* **Frontend Development (Part 7-8):** พัฒนาหน้าจอ Task Board UI และ Log Dashboard (HTTPS Fetch & RBAC)
* **Project Structure & Scaffolding:** ออกแบบและสร้างโครงสร้าง Repository, โฟลเดอร์ และไฟล์เริ่มต้นทั้งหมด
* **Documentation & Integration:** จัดทำเอกสารโครงสร้างระบบ (Architecture Diagram) และดูแลภาพรวมการเชื่อมต่อระหว่างหน้าบ้านและหลังบ้าน

---

## งานที่ดำเนินการร่วมกัน

* **Documentation:** จัดทำไฟล์ `README.md` และสรุปเนื้อหาการส่งงาน
* **Evidence Collection:** จัดเก็บ Screenshots ผลการทดสอบระบบ (Test Results) ทุกขั้นตอน
* **System Integration:** ทดสอบระบบแบบ End-to-End เพื่อตรวจสอบความถูกต้องของ Workflow ทั้งหมด

## เหตุผลในการแบ่งงาน

การแบ่งงานยึดตาม **ความถนัดของแต่ละบุคคล (Specialized Skills)** โดยแบ่งตามแนวคิด Separation of Concerns: 
* สมาชิกคนที่ 1 เน้นด้าน Systems, Security และ Backend Infrastructure 
* สมาชิกคนที่ 2 เน้นด้าน User Interface, Frontend Logic และการจัดการโครงสร้างไฟล์งาน (Project Organization) 
เพื่อให้การพัฒนาแต่ละส่วนสามารถทำควบคู่กันไปได้อย่างมีประสิทธิภาพ

## สรุปการเชื่อมโยงงานของสมาชิก

งานของทั้งสองคนเชื่อมโยงกันผ่าน **RESTful API Contract** โดยสมาชิกคนที่ 1 จัดเตรียม Backend Service ที่มีความปลอดภัยสูง (HTTPS/JWT) และสมาชิกคนที่ 2 นำข้อมูลเหล่านั้นมาแสดงผลผ่าน Frontend โดยมีการประสานงานกันอย่างใกล้ชิดในส่วนของ Authentication และการส่งค่า Token เพื่อให้หน้า Log Dashboard ทำงานได้เฉพาะสิทธิ์ Admin ตามเงื่อนไขของโจทย์
