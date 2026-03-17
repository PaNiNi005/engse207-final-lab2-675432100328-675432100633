# ENGSE207 Software Architecture Final Lab Set 2

## ข้อมูลผู้จัดทำ (กลุ่ม S1-5)
1. นางสาว รัฐจิกาลณ์ กวงคำ (รหัสนักศึกษา: 67543210063-3)
2. นาย ธนมินทร์ เปลี่ยนพร้อม (รหัสนักศึกษา: 67543210032-8)

**Repository:** `https://github.com/PaNiNi005/engse207-final-lab2-675432100328-675432100633/tree/main`

---

## Cloud Service URLs (Railway)
| Service | Public URL (Production) |
| :--- | :--- |
| Auth Service | [ระบุ URL ของ Auth Service บน Railway ที่นี่] |
| Task Service | [ระบุ URL ของ Task Service บน Railway ที่นี่] |
| User Service | [ระบุ URL ของ User Service บน Railway ที่นี่] |

---

## การต่อยอดจาก Set 1 สู่ Set 2
ในโปรเจกต์ Set 2 นี้ เป็นการพัฒนาระบบต่อยอดจาก Set 1 โดยเปลี่ยนสถาปัตยกรรมจากรูปแบบเดิมให้มีความเป็น Microservices ที่สมบูรณ์ยิ่งขึ้น ดังนี้:
1. การขยาย Service: เพิ่ม User Service เพื่อจัดการข้อมูลโปรไฟล์ และเพิ่มระบบ Register API ใน Auth Service (ซึ่งใน Set 1 ไม่มี)
2. รูปแบบฐานข้อมูล: เปลี่ยนจากฐานข้อมูลที่ใช้ร่วมกัน (Shared Database) มาเป็นรูปแบบ Database-per-Service โดยแยกฐานข้อมูล 3 ชุดอิสระต่อกัน
3. ระบบ Cloud: ย้ายการ Deploy จากการรันผ่าน Docker ในเครื่อง Local ขึ้นสู่ระบบ Cloud จริงบน Railway Platform
4. การจัดการ Logging: เปลี่ยนจาก Log Service ส่วนกลาง มาเป็นการเขียน Log ลงในฐานข้อมูลของแต่ละ Service โดยตรง เพื่อลดความซับซ้อนของการสื่อสารข้าม Network บน Cloud

---

### Architecture Diagram (Cloud Version)

สถาปัตยกรรมระบบบน Railway ประกอบด้วย 3 Services และ 3 Databases ที่ทำงานแยกกันอิสระ:

```mermaid
graph LR
    %% บังคับทิศทางจากซ้ายไปขวา (Left to Right) เพื่อให้ดูง่ายขึ้น
    
    Client[Browser / Client] -- "HTTPS" --> AuthSvc
    Client -- "HTTPS" --> TaskSvc
    Client -- "HTTPS" --> UserSvc

    subgraph "Railway Cloud Project"
        direction LR
        
        subgraph Auth_Stack [Auth Service]
            AuthSvc[Auth Service] --> AuthDB[(auth-db)]
        end

        subgraph Task_Stack [Task Service]
            TaskSvc[Task Service] --> TaskDB[(task-db)]
        end

        subgraph User_Stack [User Service]
            UserSvc[User Service] --> UserDB[(user-db)]
        end
    end

    %% แสดงความสัมพันธ์เชิงตรรกะแบบไม่รกตา
    AuthSvc -. "Validation with Shared Secret" .-> TaskSvc
    AuthSvc -. "Validation with Shared Secret" .-> UserSvc

    %% สไตล์ตกแต่ง
    style Client fill:#f1f0ff,stroke:#7b61ff
    style Auth_Stack fill:#fdfdfd,stroke:#ddd
    style Task_Stack fill:#fdfdfd,stroke:#ddd
    style User_Stack fill:#fdfdfd,stroke:#ddd

---

## Gateway Strategy
กลุ่มของเราเลือกใช้ **Option A: Frontend Direct Call (Client-side Gateway)**

**เหตุผล:** เนื่องจากแต่ละ Service บน Railway มีการจัดการ HTTPS และมอบหมาย Public URL ให้โดยเฉพาะอยู่แล้ว การให้ Frontend เรียกใช้แต่ละ Service โดยตรงผ่านไฟล์ config.js จึงเป็นวิธีที่ตั้งค่าง่ายที่สุดสำหรับการส่งงานสอบ ลดความซับซ้อนในการจัดการ Proxy และช่วยลดความหน่วง (Latency) ในการเรียกใช้ API

---

## วิธีการรัน Local ด้วย Docker Compose
หากต้องการทดสอบระบบในสภาพแวดล้อม Local ให้ดำเนินการดังนี้:

1. Clone Repository นี้ลงเครื่อง
2. ตรวจสอบไฟล์ `.env` โดยอ้างอิงจาก `.env.example` และตรวจสอบว่าค่า `JWT_SECRET` ตรงกันทุก Service
3. ใช้คำสั่งเพื่อเริ่มต้นการทำงาน:

```bash
docker-compose up --build
