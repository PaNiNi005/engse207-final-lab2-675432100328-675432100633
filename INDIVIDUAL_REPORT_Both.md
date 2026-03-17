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
 * **กำหนดค่า:** DATABASE_URL และ JWT_SECRET ให้สัมพันธ์กันระหว่างแต่ละ Service
 * **จัดการระบบ:** Networking ให้แต่ละ Service สามารถสื่อสารกันได้ผ่าน Cloud Endpoints
* Refactored Logging Strategy: ยกเลิก Log Service แบบเดิม และเปลี่ยนมาเขียนระบบ Logging ภายในแต่ละ Microservice โดยตรง เพื่อลด Latency และเพิ่มความอิสระในการตรวจสอบข้อมูล (In-service logs)
* Data Integrity: ออกแบบการเชื่อมโยงข้อมูลระหว่างฐานข้อมูลแบบ Logical Reference โดยใช้ user_id จาก JWT แทนการใช้ Foreign Key ข้ามฐานข้อมูล เพื่อคงความอิสระของแต่ละ Service

## ปัญหาที่พบและวิธีการแก้ไข

* ปัญหาเรื่องการ Verify JWT บน Cloud: เมื่อแยก Service บน Railway พบว่าบาง Service ไม่สามารถตรวจสอบ Token ได้เนื่องจากความผิดพลาดในการระบุค่า Secret
 * **วิธีแก้ไข:** ตรวจสอบและซิงค์ JWT_SECRET ในระบบ Environment Variables ของทุก Service ให้ตรงกันทั้งหมด และทดสอบการส่งผ่าน Token ระหว่าง Service
* ปัญหา Database Connection Timeout: ในช่วงแรกที่รันบน Railway ตัว Service มักจะล้มเหลวเพราะฐานข้อมูลยังไม่พร้อมใช้งาน (Ready)
 * **วิธีแก้ไข:** เพิ่มฟังก์ชัน Retry Logic ในส่วนการเชื่อมต่อฐานข้อมูล (Database Connection Helper) เพื่อให้ระบบพยายามเชื่อมต่อซ้ำจนกว่าจะสำเร็จก่อนเริ่มรัน Server
* ปัญหาการจัดการ Schema บน Cloud: ไม่สามารถรันไฟล์ init.sql ผ่าน Docker Entrypoint ได้เหมือนใน Local
 * **วิธีแก้ไข:** ปรับปรุงโค้ดใน index.js ให้ทำการตรวจสอบและสร้าง Table (DDL) อัตโนมัติเมื่อ Service เริ่มทำงาน (Auto-migration/Initialize)

## สิ่งที่ได้เรียนรู้จากงานนี้

* Cloud-Native Development: เข้าใจกระบวนการนำระบบ Microservices ขึ้นใช้งานจริงบน Cloud และการจัดการค่า Configuration ต่างๆ ในสภาวะแวดล้อมที่ต่างจากเครื่อง Local
* Microservices Autonomy: ได้เห็นข้อดีของการแยกฐานข้อมูล (Database-per-Service) ที่ช่วยให้การแก้ไข Service หนึ่งไม่ส่งผลกระทบต่อโครงสร้างข้อมูลของ Service อื่น
* PaaS Efficiency: เรียนรู้วิธีการใช้ความสามารถของ Railway ในการจัดการ HTTPS, Health Checks และ Deployment Pipelines ซึ่งช่วยลดภาระงานด้าน Infrastructure ไปได้มาก
* Scalable Architecture: เข้าใจความสำคัญของ API Gateway Strategy และการเลือกใช้แนวทางที่เหมาะสมกับขนาดและความซับซ้อนของระบบ



----



# INDIVIDUAL_REPORT_67543210063-3.md

## ข้อมูลผู้จัดทำ

**ชื่อ-นามสกุล:** นางสาว รัฐจิกาลณ์ กวงคำ  
**รหัสนักศึกษา:** 67543210063-3  
**กลุ่ม:** S1-5

## ขอบเขตงานที่รับผิดชอบ

ในโปรเจกต์ Set 2 นี้ รับผิดชอบหลักในส่วนของ Frontend Development โดยมีรายละเอียดดังนี้:
* พัฒนาและปรับปรุงหน้าจอส่วนหน้า (UI) เพื่อรองรับฟีเจอร์ใหม่ในระบบ Microservices
* จัดการระบบการตั้งค่า (Configuration Management) เพื่อให้ Frontend สามารถเชื่อมต่อกับ API บน Cloud ได้อย่างถูกต้อง
* สนับสนุนการตั้งค่าเบื้องต้นบนระบบ Railway สำหรับบาง Service
* จัดทำเอกสารสรุปผลการดำเนินงานและโครงสร้างของโปรเจกต์ (Project Documentation)

## สิ่งที่ได้ดำเนินการด้วยตนเอง

* Frontend UI Development: * ปรับปรุงไฟล์ index.html ให้เพิ่มระบบการสมัครสมาชิก (Register) เพื่อทำงานร่วมกับ Auth Service ใหม่
* พัฒนาไฟล์ profile.html ซึ่งเป็นหน้าที่สร้างขึ้นใหม่เพื่อดึงและแสดงข้อมูลผู้ใช้งานจาก User Service
* Cloud Configuration: จัดการไฟล์ config.js เพื่อรวบรวม URL ของ Microservices ต่างๆ (Auth, Task, User) ที่รันอยู่บน Railway ช่วยให้การเรียกใช้ API จากฝั่ง Client เป็นไปอย่างเป็นระบบและแก้ไขได้ง่ายในจุดเดียว
* Documentation: จัดทำเอกสารประกอบการส่งงาน ทั้งในส่วนของสถาปัตยกรรมระบบเบื้องต้นและขั้นตอนการทดสอบ เพื่อให้ทีมและอาจารย์ผู้ตรวจเข้าใจโครงสร้างของ Set 2

## ปัญหาที่พบและวิธีการแก้ไข

* ปัญหาหน้าโปรไฟล์ไม่สามารถบันทึกข้อมูลได้: หลังจากพัฒนาหน้า profile.html พบว่าเมื่อกดบันทึกข้อมูล (Update Profile) ระบบไม่สามารถส่งข้อมูลไปบันทึกที่ User Service ได้
    * **วิธีแก้ไข:** ได้ปรับปรุงไฟล์ config.js ให้ระบุ URL ของ User Service ให้ถูกต้อง และประสานงานกับเพื่อนในทีมเพื่อตรวจสอบว่า User Service บน Railway ได้อนุญาตให้มีการส่ง Method PUT กลับมาอย่างถูกต้องแล้ว

## สิ่งที่ได้เรียนรู้จากงานนี้

* Frontend Configuration in Microservices: เข้าใจความสำคัญของไฟล์ Config กลาง (เช่น config.js) ในการจัดการ URL ของหลายๆ Service ซึ่งมีความซับซ้อนกว่าการทำ Monolith ใน Set 1
* User Profile Management: ได้เรียนรู้วิธีการดึงข้อมูลส่วนตัว (Identity) จาก JWT และนำมาแสดงผลรวมถึงการจัดการสถานะ (State) ของ UI ในหน้าโปรไฟล์
* Cloud Services Overview: ได้สัมผัสประสบการณ์การนำ Code ขึ้นไปรันบน Production Environment จริงอย่าง Railway และเข้าใจความแตกต่างระหว่างการทดสอบบน Local และ Cloud
* Collaboration & Documentation: เห็นความสำคัญของการทำเอกสารที่ชัดเจน เพราะเมื่อระบบแยกเป็นหลาย Service การสื่อสารผ่านเอกสารจะช่วยลดความสับสนในทีมได้มาก




----
