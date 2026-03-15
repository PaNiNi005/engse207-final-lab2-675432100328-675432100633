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
      Browser / Postman
             │
             │ HTTPS :443
             ▼
      Nginx (API Gateway)
         ├── /api/auth/* → auth-service
         ├── /api/tasks/* → task-service
         ├── /api/logs/* → log-service
         └── /            → frontend
                  │
                  ▼
           PostgreSQL (shared DB)
Services ที่ใช้ในระบบnginx — API Gateway, HTTPS, rate limitingfrontend — หน้าเว็บ Task Board และ Log Dashboardauth-service — Login, Verify, Metask-service — CRUD Taskslog-service — รับและแสดง logspostgres — shared database5. โครงสร้าง RepositoryPlaintextfinal-lab-set1/
├── README.md
├── TEAM_SPLIT.md
├── INDIVIDUAL_REPORT_[studentid].md
├── docker-compose.yml
├── .env.example
├── nginx/
├── frontend/
├── auth-service/
├── task-service/
├── log-service/
├── db/
├── scripts/
└── screenshots/
6. เทคโนโลยีที่ใช้Node.js / Express.jsPostgreSQLNginxDocker / Docker ComposeHTML / CSS / JavaScriptJWTbcryptjs7. การตั้งค่าและการรันระบบ7.1 สร้าง Self-Signed CertificateBashchmod +x scripts/gen-certs.sh
./scripts/gen-certs.sh
7.2 สร้างไฟล์ .envคัดลอกจาก .env.example แล้วกำหนดค่าตามต้องการ เช่น:PlaintextPOSTGRES_DB=taskboard
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123
JWT_SECRET=engse207-super-secret-change-me
JWT_EXPIRES=1h
7.3 สร้าง bcrypt hash สำหรับ Seed Usersในงานชุดนี้ กลุ่มของเรากำหนดให้ สร้าง bcrypt hash เอง ก่อนรันระบบตัวอย่างคำสั่ง:Bashnode -e "const b=require('bcryptjs'); console.log(b.hashSync('alice123',10))"
node -e "const b=require('bcryptjs'); console.log(b.hashSync('bob456',10))"
node -e "const b=require('bcryptjs'); console.log(b.hashSync('adminpass',10))"
จากนั้นนำค่าที่ได้ไปแทนในไฟล์ db/init.sql7.4 รันระบบBashdocker compose down -v
docker compose up --build
7.5 เปิดใช้งานผ่าน BrowserFrontend: https://localhostLog Dashboard: https://localhost/logs.htmlหมายเหตุ: เนื่องจากใช้ self-signed certificate browser อาจขึ้นคำเตือนด้านความปลอดภัย ให้กดยอมรับเพื่อเข้าทดสอบ8. Seed Users สำหรับทดสอบUsernameEmailPasswordRolealicealice@lab.localalice123memberbobbob@lab.localbob456memberadminadmin@lab.localadminpassadminหมายเหตุ: ต้อง generate bcrypt hash จริงแล้วแทนค่าลงใน db/init.sql ก่อน login9. API SummaryAuth ServicePOST /api/auth/loginGET /api/auth/verifyGET /api/auth/meGET /api/auth/healthTask ServiceGET /api/tasks/healthGET /api/tasks/POST /api/tasks/PUT /api/tasks/:idDELETE /api/tasks/:idLog ServicePOST /api/logs/internalGET /api/logs/GET /api/logs/statsGET /api/logs/health10. การทดสอบระบบตัวอย่างลำดับการทดสอบรัน docker compose up --buildเปิด https://localhostLogin ด้วย seed usersสร้าง, ดู, แก้ไข, ลบ taskทดสอบกรณีไม่มี JWT → ต้องได้ 401ทดสอบ Log Dashboardตัวอย่าง curlBashBASE="https://localhost"
TOKEN=$(curl -sk -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@lab.local","password":"alice123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

curl -sk $BASE/api/tasks/ -H "Authorization: Bearer $TOKEN"
11. Screenshots ที่แนบในงานโฟลเดอร์ screenshots/ ของกลุ่มนี้ประกอบด้วย:01_docker_running.png, 02_https_browser.png, 03_login_success.png, 04_login_fail.png, 05_create_task.png, 06_get_tasks.png, 07_update_task.png, 08_delete_task.png, 09_no_jwt_401.png, 10_logs_api.png, 11_rate_limit.png, 12_frontend_screenshot.png12. การแบ่งงานของทีมรายละเอียดการแบ่งงานของสมาชิกอยู่ในไฟล์ TEAM_SPLIT.md และรายงานรายบุคคลอยู่ใน INDIVIDUAL_REPORT_[studentid].md13. ปัญหาที่พบและแนวทางแก้ไขปัญหา seed users login ไม่ได้เพราะยังไม่ได้ generate bcrypt hashปัญหา nginx route ไม่ตรง path ของ serviceปัญหา JWT verification ระหว่าง servicesปัญหา log dashboard ถูกจำกัดสิทธิ์ admin only14. ข้อจำกัดของระบบใช้ self-signed certificate, ใช้ shared database, ยังไม่มีระบบ register15. การต่อยอดไปยัง Set 2เพิ่ม Register API, เพิ่ม User Service, เปลี่ยนจาก shared DB ไปเป็น database-per-service, Deploy บน Cloud16. ภาคผนวกไฟล์สำคัญ: docker-compose.yml, nginx/nginx.conf, db/init.sql, auth-service/src/routes/auth.js, task-service/src/routes/tasks.js, log-service/src/index.js, frontend/index.html, frontend/logs.htmlเอกสารฉบับนี้เป็น README สำหรับงาน Final Lab Set 1 และจัดทำเพื่อประกอบการส่งงานในรายวิชา ENGSE207 Software Architecture
