FROM nginx:1.25-alpine
RUN rm -rf /usr/share/nginx/html/*

# ใช้เครื่องหมาย * เพื่อก๊อปปี้ทุกอย่างในโฟลเดอร์ frontend ไปวางที่ปลายทาง
COPY frontend/* /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]