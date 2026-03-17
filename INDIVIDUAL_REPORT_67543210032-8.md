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

* ปัญหาเรื่องการ Verify JWT บน Cloud: เมื่อแยก Service บน Railway พบว่าบาง Service ไม่สามารถตรวจสอบ Token ได้เนื่องจากความผิดพลาดในการระบุค่า Secret
วิธีแก้ไข: ตรวจสอบและซิงค์ JWT_SECRET ในระบบ Environment Variables ของทุก Service ให้ตรงกันทั้งหมด และทดสอบการส่งผ่าน Token ระหว่าง Service

ปัญหา Database Connection Timeout: ในช่วงแรกที่รันบน Railway ตัว Service มักจะล้มเหลวเพราะฐานข้อมูลยังไม่พร้อมใช้งาน (Ready)

วิธีแก้ไข: เพิ่มฟังก์ชัน Retry Logic ในส่วนการเชื่อมต่อฐานข้อมูล (Database Connection Helper) เพื่อให้ระบบพยายามเชื่อมต่อซ้ำจนกว่าจะสำเร็จก่อนเริ่มรัน Server

ปัญหาการจัดการ Schema บน Cloud: ไม่สามารถรันไฟล์ init.sql ผ่าน Docker Entrypoint ได้เหมือนใน Local

วิธีแก้ไข: ปรับปรุงโค้ดใน index.js ให้ทำการตรวจสอบและสร้าง Table (DDL) อัตโนมัติเมื่อ Service เริ่มทำงาน (Auto-migration/Initialize)

## สิ่งที่ได้เรียนรู้จากงานนี้

* Cloud-Native Development: เข้าใจกระบวนการนำระบบ Microservices ขึ้นใช้งานจริงบน Cloud และการจัดการค่า Configuration ต่างๆ ในสภาวะแวดล้อมที่ต่างจากเครื่อง Local
* Microservices Autonomy: ได้เห็นข้อดีของการแยกฐานข้อมูล (Database-per-Service) ที่ช่วยให้การแก้ไข Service หนึ่งไม่ส่งผลกระทบต่อโครงสร้างข้อมูลของ Service อื่น
* PaaS Efficiency: เรียนรู้วิธีการใช้ความสามารถของ Railway ในการจัดการ HTTPS, Health Checks และ Deployment Pipelines ซึ่งช่วยลดภาระงานด้าน Infrastructure ไปได้มาก
* Scalable Architecture: เข้าใจความสำคัญของ API Gateway Strategy และการเลือกใช้แนวทางที่เหมาะสมกับขนาดและความซับซ้อนของระบบ

## แนวทางการพัฒนาต่อไปใน Set 2

****
--------------
