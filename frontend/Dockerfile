FROM nginx:1.25-alpine

# ลบไฟล์หน้า Welcome เดิมของ Nginx ทิ้งก่อน
RUN rm /usr/share/nginx/html/*

# ก๊อปไฟล์จากโฟลเดอร์ frontend ใน GitHub ไปวางที่ Root ของ Nginx (ห้ามใส่โฟลเดอร์ปลายทางซ้อน)
COPY frontend/index.html /usr/share/nginx/html/index.html
COPY frontend/profile.html /usr/share/nginx/html/profile.html
COPY frontend/Config.js /usr/share/nginx/html/config.js

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]