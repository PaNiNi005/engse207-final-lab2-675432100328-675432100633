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
graph TD
    %% -- ชั้น Client --
    Client[Browser / Client]
    
    %% -- กำหนดกลุ่ม Railway Project เพื่อจัดองค์ประกอบ --
    subgraph Railway Project
        direction TB
        
        %% -- ชั้น Microservices (เรียงซ้ายไปขวา) --
        ServicesLayer:::hidden
        AuthSvc[Auth Service]
        TaskSvc[Task Service]
        UserSvc[User Service]
        ServicesLayer --- AuthSvc
        ServicesLayer --- TaskSvc
        ServicesLayer --- UserSvc
        
        %% -- ชั้น Databases (เรียงซ้ายไปขวาให้ตรงกับ Service) --
        DBsLayer:::hidden
        AuthDB[(auth-db)]
        TaskDB[(task-db)]
        UserDB[(user-db)]
        DBsLayer --- AuthDB
        DBsLayer --- TaskDB
        DBsLayer --- UserDB

        %% -- การเชื่อมต่อภายใน (Service ไปยัง DB ของตัวเอง) --
        AuthSvc --> AuthDB
        TaskSvc --> TaskDB
        UserSvc --> UserDB
    end

    %% -- ชั้น Client เชื่อมต่อกับทุก Service ด้วย HTTPS --
    Client -- "HTTPS" --> AuthSvc
    Client -- "HTTPS" --> TaskSvc
    Client -- "HTTPS" --> UserSvc

    %% -- ความสัมพันธ์เชิงตรรกะ (Shared JWT Secret) --
    AuthSvc -. "Shared JWT Secret" .-> TaskSvc
    AuthSvc -. "Shared JWT Secret" .-> UserSvc

    %% -- กำหนด Style เพื่อความสวยงาม --
    classDef plain fill:#fff,stroke:#fff,stroke-width:0px,color:#fff;
    classDef hidden display:none;
    class ServicesLayer,DBsLayer hidden;
    
    %% ปรับสีกล่อง Service ให้ดูโปร่งขึ้น (ตามภาพต้นฉบับแต่ปรับให้สบายตา)
    classDef svcFilled fill:#f1f0ff,stroke:#8f8f8f,stroke-width:1px,rx:5,ry:5;
    class AuthSvc,TaskSvc,UserSvc svcFilled;
    
    %% ปรับสี Database
    classDef dbFilled fill:#fff,stroke:#8f8f8f,stroke-width:1px;
    class AuthDB,TaskDB,UserDB dbFilled;
    
    %% ปรับสี Client
    classDef clientFilled fill:#f1f0ff,stroke:#8f8f8f,stroke-width:1px,rx:5,ry:5;
    class Client clientFilled;

    %% ปรับสีเส้น Shared Secret
    linkStyle 6,7 stroke:#A9A9A9,stroke-dasharray: 5 5;
