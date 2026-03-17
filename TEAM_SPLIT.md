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

* **Backend Microservices:** พัฒนาและปรับปรุงโค้ดฝั่ง Server (Auth, Task, User Services) และเพิ่ม Register API
* **Infrastructure & Cloud Deployment:** จัดการระบบฐานข้อมูลแบบแยกส่วน (Database-per-Service) และ Deploy ระบบขึ้น Railway
* **Security & JWT:** ตั้งค่าการตรวจสอบสิทธิ์ (Authentication) และการจัดการ Environment Variables (Secrets) บน Cloud
* **Database Schema:** ออกแบบและเตรียมความพร้อมของฐานข้อมูล PostgreSQL ทั้ง 3 ชุด

### สมาชิกคนที่ 2: นางสาว รัฐจิกาลณ์ กวงคำ

**รับผิดชอบงานหลักดังต่อไปนี้**

* **Frontend Development:** พัฒนาและปรับปรุง UI ทั้งหมด (index.html, profile.html) ให้รองรับระบบ Microservices
* **Service Configuration:** จัดการไฟล์ config.js สำหรับเชื่อมต่อ Frontend เข้ากับ Cloud Endpoints ของแต่ละ Service
* **Documentation & Templates:** จัดทำรายงานสรุปผลการดำเนินงานรายบุคคล และเตรียมโครงสร้างเอกสารของกลุ่ม
* **Cloud Testing:** ตรวจสอบความถูกต้องของการแสดงผลข้อมูลบนระบบ Railway

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
