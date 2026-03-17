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
    
    %% -- ชั้น Microservices (จัดกลุ่มให้อยู่ระดับเดียวกัน) --
    subgraph Services [Railway Cloud Services]
        direction LR
        AuthSvc[Auth Service]
        TaskSvc[Task Service]
        UserSvc[User Service]
    end

    %% -- ชั้น Databases (วางไว้ใต้ Service ของตัวเองตรงๆ) --
    AuthDB[(auth-db)]
    TaskDB[(task-db)]
    UserDB[(user-db)]

    %% -- การเชื่อมต่อจาก Client ไปยังแต่ละ Service (เส้นจะเรียงขนานกันสวยงาม) --
    Client ==>|HTTPS| AuthSvc
    Client ==>|HTTPS| TaskSvc
    Client ==>|HTTPS| UserSvc

    %% -- การเชื่อมต่อภายใน (Service -> Database) --
    AuthSvc --> AuthDB
    TaskSvc --> TaskDB
    UserSvc --> UserDB

    %% -- ความสัมพันธ์เชิงตรรกะ (ใช้เส้นประเพื่อไม่ให้กวนสายตา) --
    AuthSvc -.->|Shared Secret| TaskSvc
    AuthSvc -.->|Shared Secret| UserSvc

    %% -- สไตล์ตกแต่งให้ดูสะอาดตา --
    style Client fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style Services fill:#f5f5f5,stroke:#9e9e9e,stroke-dasharray: 5 5
    style AuthSvc fill:#ffffff,stroke:#673ab7,stroke-width:2px
    style TaskSvc fill:#ffffff,stroke:#673ab7,stroke-width:2px
    style UserSvc fill:#ffffff,stroke:#673ab7,stroke-width:2px
    style AuthDB fill:#ffffff,stroke:#333
    style TaskDB fill:#ffffff,stroke:#333
    style UserDB fill:#ffffff,stroke:#333
