FROM nginx:1.25-alpine
RUN rm -rf /usr/share/nginx/html/*

# ลบคำว่า frontend/ ออก เพราะตอนนี้เรายืนอยู่ในโฟลเดอร์นั้นแล้ว
COPY . /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]