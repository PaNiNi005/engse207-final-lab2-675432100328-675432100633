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

* **Frontend Development:** พัฒนาไฟล์ `index.html` และ `logs.html` โดยเน้นการสร้าง UI ที่เป็น Single Page Application (SPA) และรองรับการทำงานแบบ Responsive
* **RBAC Implementation (Frontend):** เขียน Logic สำหรับตรวจสอบสิทธิ์ผู้ใช้ (Role-Based Access Control) โดยซ่อนเมนู Users และจำกัดการเข้าถึงหน้า Log Dashboard ให้เข้าได้เฉพาะ Admin เท่านั้น
* **Security Integration:** ปรับปรุงฟังก์ชัน `fetch()` ให้รองรับ HTTPS และจัดการระบบการเก็บ JWT Token ไว้ใน `localStorage` พร้อมระบบ Auto-login เมื่อมีการ Refresh หน้าจอ
* **Logging Display:** พัฒนาส่วนแสดงผล Log ที่ดึงข้อมูลจาก Server โดยตรง (แทนการใช้ localStorage) และเพิ่มระบบ Filter ตามระดับความรุนแรง (Level) และ Service
* **Project Organization:** วางโครงสร้างโฟลเดอร์สำหรับแบ่งแยก Service ต่างๆ ออกจากกัน เพื่อให้สมาชิกในทีมสามารถพัฒนา Backend และ Infrastructure ได้อย่างเป็นระเบียบ

## ปัญหาที่พบและวิธีการแก้ไข

* **ปัญหาเรื่อง Mixed Content & HTTPS:** ในช่วงแรกพยายามเชื่อมต่อ Frontend เข้ากับ API ผ่าน HTTP ปกติ แต่เมื่อตั้งค่า Nginx เป็น HTTPS ทำให้เบราว์เซอร์บล็อกการส่งข้อมูล (Mixed Content Error)
    * **วิธีแก้ไข:** ปรับปรุงค่าตัวแปร `API` ใน JavaScript ให้เรียกผ่าน `https://localhost` ทั้งหมด และตรวจสอบว่า API Gateway (Nginx) ส่ง Header ที่จำเป็นกลับมาอย่างถูกต้อง
* **ปัญหาการแสดงผล Log Dashboard:** การโหลดข้อมูล Log จำนวนมากทำให้หน้าจอค้างและ UI แสดงผลไม่ทัน
    * **วิธีแก้ไข:** เพิ่มระบบกรองข้อมูล (Filter) ที่ฝั่ง Client-side เพื่อลดปริมาณการเรนเดอร์ และจัดการการแสดงผลแบบมีเงื่อนไข (Conditional Rendering) เพื่อให้ Dashboard ทำงานได้ราบรื่นขึ้น

## สิ่งที่ได้เรียนรู้จากงานนี้

* **Service Separation:** เข้าใจความสำคัญของการแยกส่วนงานระหว่าง Frontend และ Backend (Separation of Concerns) ซึ่งช่วยให้พัฒนาและแก้ไขข้อผิดพลาดได้รวดเร็วขึ้น
* **JWT & Authentication Flow:** ได้เรียนรู้ขั้นตอนการทำงานของ JWT อย่างละเอียด ตั้งแต่การรับ Token, การเก็บรักษา, ไปจนถึงการแนบไปกับ Authorization Header ในทุก Request
* **HTTPS & Security:** เข้าใจความสำคัญของการใช้ SSL/TLS ในระดับสถาปัตยกรรม โดยเฉพาะเมื่อมีการรับส่งข้อมูลที่สำคัญ เช่น รหัสผ่าน หรือ Log ของระบบ
* **Team Collaboration:** ได้เรียนรู้การทำงานร่วมกันผ่าน Git และการกำหนด API Contract ล่วงหน้าเพื่อให้งานฝั่ง UI และ API Gateway ทำงานสอดประสานกันได้

## แนวทางการพัฒนาต่อไปใน Set 2

หากต้องต่อยอดไปยัง Set 2 ควรมีการปรับปรุงดังนี้:
* **Separated Frontend Service:** แยกส่วน Frontend ออกมาเป็นอิสระ (เช่น ใช้ React หรือ Vue) และรันผ่าน Docker แยกจาก Nginx เพื่อให้รองรับการ Scale ในอนาคต
* **Real-time Monitoring:** เปลี่ยนระบบ Auto-refresh จากการดึงข้อมูลทุก 5 วินาที เป็นการใช้ WebSockets (Socket.io) เพื่อให้ Log Dashboard แสดงผลแบบ Real-time ทันทีที่มี Event เกิดขึ้น
* **Advanced UI/UX:** เพิ่มระบบ Pagination ในการดึง Log จาก Database เพื่อลดภาระการทำงานของเบราว์เซอร์เมื่อระบบมีข้อมูลจำนวนมหาศาล
