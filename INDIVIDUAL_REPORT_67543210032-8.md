# INDIVIDUAL_REPORT_67543210032-8.md

## ข้อมูลผู้จัดทำ

**ชื่อ-นามสกุล:** นาย ธนมินทร์ เปลี่ยนพร้อม  
**รหัสนักศึกษา:** 67543210032-8  
**กลุ่ม:** S1-5

## ขอบเขตงานที่รับผิดชอบ

ในโปรเจกต์ Set 2 นี้ รับผิดชอบการเปลี่ยนผ่านสถาปัตยกรรมจาก Local สู่ Cloud-Native Microservices และการจัดการข้อมูลแบบแยกส่วน โดยมีรายละเอียดดังนี้:
* ออกแบบและพัฒนา User Service (New Service) เพื่อจัดการข้อมูล Profile และสิทธิ์ผู้ใช้งาน
* พัฒนาฟีเจอร์ Register API เพิ่มเติมใน Auth Service เพื่อรองรับ End-to-end User Flow\
* ปรับปรุงระบบ Logging จากเดิมที่เป็น Service แยก ให้เป็นแบบ Database-per-Service Logging
* ดำเนินการด้าน Cloud Infrastructure โดย Deploy ทั้ง 3 Services และ 3 Databases บน Railway
* จัดการระบบความปลอดภัยผ่าน Shared JWT Secret และการตั้งค่า Environment Variables บนระบบ Cloud

## สิ่งที่ได้ดำเนินการด้วยตนเอง

* Backend Expansion: พัฒนา User Service ด้วย Node.js เพื่อรองรับการทำงานของระบบโปรไฟล์ และเพิ่มความสามารถในการสมัครสมาชิก (Register) ใน Auth Service พร้อมระบบ Hash รหัสผ่านด้วย bcrypt
* Database-per-Service Migration: แยกฐานข้อมูล PostgreSQL ออกเป็น 3 อินสแตนซ์อิสระ (auth-db, task-db, user-db) บน Railway เพื่อให้สอดคล้องกับหลักสถาปัตยกรรม Microservices ที่ดี
* Cloud Deployment & Orchestration: * ทำการ Deploy Microservices ทั้งหมดขึ้นบน Railway Platform
* **กำหนดค่า DATABASE_URL และ JWT_SECRET ให้สัมพันธ์กันระหว่างแต่ละ Service
* **จัดการระบบ Networking ให้แต่ละ Service สามารถสื่อสารกันได้ผ่าน Cloud Endpoints
* Refactored Logging Strategy: ยกเลิก Log Service แบบเดิม และเปลี่ยนมาเขียนระบบ Logging ภายในแต่ละ Microservice โดยตรง เพื่อลด Latency และเพิ่มความอิสระในการตรวจสอบข้อมูล (In-service logs)
* Data Integrity: ออกแบบการเชื่อมโยงข้อมูลระหว่างฐานข้อมูลแบบ Logical Reference โดยใช้ user_id จาก JWT แทนการใช้ Foreign Key ข้ามฐานข้อมูล เพื่อคงความอิสระของแต่ละ Service

## ปัญหาที่พบและวิธีการแก้ไข

* ปัญหาเรื่องการ Verify JWT บน Cloud: เมื่อแยก Service บน Railway พบว่าบาง Service ไม่สามารถตรวจสอบ Token ได้เนื่องจากความผิดพลาดในการระบุค่า Secret
* **วิธีแก้ไข: ตรวจสอบและซิงค์ JWT_SECRET ในระบบ Environment Variables ของทุก Service ให้ตรงกันทั้งหมด และทดสอบการส่งผ่าน Token ระหว่าง Service
* ปัญหา Database Connection Timeout: ในช่วงแรกที่รันบน Railway ตัว Service มักจะล้มเหลวเพราะฐานข้อมูลยังไม่พร้อมใช้งาน (Ready)
* **วิธีแก้ไข: เพิ่มฟังก์ชัน Retry Logic ในส่วนการเชื่อมต่อฐานข้อมูล (Database Connection Helper) เพื่อให้ระบบพยายามเชื่อมต่อซ้ำจนกว่าจะสำเร็จก่อนเริ่มรัน Server
* ปัญหาการจัดการ Schema บน Cloud: ไม่สามารถรันไฟล์ init.sql ผ่าน Docker Entrypoint ได้เหมือนใน Local
* **วิธีแก้ไข: ปรับปรุงโค้ดใน index.js ให้ทำการตรวจสอบและสร้าง Table (DDL) อัตโนมัติเมื่อ Service เริ่มทำงาน (Auto-migration/Initialize)

## สิ่งที่ได้เรียนรู้จากงานนี้

* Cloud-Native Development: เข้าใจกระบวนการนำระบบ Microservices ขึ้นใช้งานจริงบน Cloud และการจัดการค่า Configuration ต่างๆ ในสภาวะแวดล้อมที่ต่างจากเครื่อง Local
* Microservices Autonomy: ได้เห็นข้อดีของการแยกฐานข้อมูล (Database-per-Service) ที่ช่วยให้การแก้ไข Service หนึ่งไม่ส่งผลกระทบต่อโครงสร้างข้อมูลของ Service อื่น
* PaaS Efficiency: เรียนรู้วิธีการใช้ความสามารถของ Railway ในการจัดการ HTTPS, Health Checks และ Deployment Pipelines ซึ่งช่วยลดภาระงานด้าน Infrastructure ไปได้มาก
* Scalable Architecture: เข้าใจความสำคัญของ API Gateway Strategy และการเลือกใช้แนวทางที่เหมาะสมกับขนาดและความซับซ้อนของระบบ

## แนวทางการพัฒนาต่อไปใน Set 2

****
--------------
