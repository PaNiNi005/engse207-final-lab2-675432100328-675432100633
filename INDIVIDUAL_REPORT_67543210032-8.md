# INDIVIDUAL_REPORT_67543210032-8.md

## ข้อมูลผู้จัดทำ

**ชื่อ-นามสกุล:** นาย ธนมินทร์ เปลี่ยนพร้อม  
**รหัสนักศึกษา:** 67543210032-8  
**กลุ่ม:** S1-5

## ขอบเขตงานที่รับผิดชอบ

รับผิดชอบในส่วนของ **Infrastructure, Backend Services** และ **Security Architecture** โดยมีรายละเอียดดังนี้:
* การตั้งค่า **HTTPS Nginx (API Gateway)** และการจัดการ Self-Signed Certificate
* พัฒนา **Auth Service, Task Service** และ **Log Service** (Microservices)
* ออกแบบ **Database Schema** และจัดการ **Seed Users** สำหรับระบบ
* การทำ **Containerization** ด้วย Docker Compose เพื่อรวมทุก Service เข้าด้วยกัน
* การทดสอบระบบด้วย **curl commands** และจัดทำ Test Cases (Part 9)

## สิ่งที่ได้ดำเนินการด้วยตนเอง

* **HTTPS & Gateway Configuration:** ตั้งค่า Nginx ให้ทำหน้าที่เป็น Reverse Proxy และทำ HTTPS Termination โดยใช้ Certificate ที่สร้างขึ้นเอง เพื่อความปลอดภัยในการสื่อสารข้อมูล
* **Microservices Development:** พัฒนา Backend ทั้ง 3 ส่วนโดยใช้ Node.js/Express:
    * **Auth Service:** ระบบจัดการ Login และออก JWT Token พร้อมเก็บ Password แบบ Encrypted (Hashing)
    * **Task Service:** ระบบจัดการข้อมูลงาน (CRUD) ที่มีการตรวจสอบสิทธิ์ผ่าน Middleware
    * **Log Service:** ระบบบันทึก Event สำคัญลง Database พร้อม API สำหรับเรียกดูข้อมูลและสถิติ (Stats)
* **Security Implementation:** พัฒนา Middleware สำหรับตรวจสอบ JWT และจำกัดสิทธิ์การเข้าถึง (RBAC) โดยเฉพาะส่วนของ Log API ที่อนุญาตให้เฉพาะสิทธิ์ Admin เท่านั้น
* **Containerization:** เขียน `Dockerfile` สำหรับแต่ละ Service และไฟล์ `docker-compose.yml` เพื่อให้ระบบทั้งหมดสามารถรันขึ้นมาได้ด้วยคำสั่งเดียวและสื่อสารกันผ่าน Docker Network
* **Database & Seeding:** เขียน Script สำหรับล้างข้อมูลและสร้างข้อมูลผู้ใช้เริ่มต้น (Alice, Bob, Admin) เพื่อให้ระบบพร้อมสำหรับการทดสอบทันที

## ปัญหาที่พบและวิธีการแก้ไข

* **ปัญหาการสื่อสารระหว่าง Docker Containers:** ในช่วงแรก Services ไม่สามารถเชื่อมต่อฐานข้อมูลได้เนื่องจากใช้ `localhost` ใน Connection String 
    * **วิธีแก้ไข:** เปลี่ยนไปใช้ชื่อ Service (เช่น `db-service`) ที่กำหนดใน Docker Compose แทนการใช้ IP หรือ localhost เพื่อให้ระบบ DNS ของ Docker จัดการเส้นทางให้ถูกต้อง
* **ปัญหา JWT Validation:** พบปัญหา Token ไม่ผ่านการตรวจสอบเมื่อข้าม Service เนื่องจากปัญหาเรื่อง Secret Key หรือการดึงค่าจาก Header
    * **วิธีแก้ไข:** ตรวจสอบการจัดการสภาพแวดล้อม (Environment Variables) ให้ทุก Service ใช้ Secret เดียวกัน และปรับ Middleware ให้รองรับรูปแบบ `Bearer <token>` อย่างถูกต้อง

## สิ่งที่ได้เรียนรู้จากงานนี้

* **Microservices Architecture:** เข้าใจการแยกส่วนหน้าที่ของ Service (Separation of Concerns) และความท้าทายในการจัดการข้อมูลที่กระจายตัวอยู่คนละส่วน
* **HTTPS Termination:** ได้เรียนรู้บทบาทของ API Gateway ในการจัดการความปลอดภัย (SSL/TLS) ก่อนจะส่งต่อ Request ไปยัง Backend
* **Database Seeding & Integrity:** เข้าใจความสำคัญของการเตรียมข้อมูลเริ่มต้น (Seed Data) และการรักษาความสัมพันธ์ของข้อมูลในระดับ Database Schema
* **Container Orchestration:** เห็นภาพรวมของการจัดการ Lifecycle ของ Application หลายๆ ตัวพร้อมกันด้วย Docker Compose ซึ่งช่วยให้สภาพแวดล้อมการพัฒนามีความเสถียรและเหมือนกันในทุกเครื่อง

## แนวทางการพัฒนาต่อไปใน Set 2

หากต้องต่อยอดไปยัง Set 2 ควรมีการปรับปรุงดังนี้:
* **Centralized Logging:** พัฒนาให้ Log Service รับข้อมูลผ่าน Message Broker (เช่น RabbitMQ) เพื่อลดการหน่วง (Latency) ของระบบหลักเมื่อมีการบันทึก Log จำนวนมาก
* **Database Separation:** แยก Database ออกเป็นราย Service (Database per Service) เพื่อให้แต่ละ Microservice เป็นอิสระจากกันอย่างแท้จริงตามหลักสถาปัตยกรรมที่ดี
* **Service Mesh:** นำเครื่องมืออย่าง Kong หรือ Traefik มาจัดการ API Gateway แทน Nginx เพื่อการจัดการ Route และ Rate Limiting ที่ซับซ้อนขึ้น
