# LUNA DREAM - Tuyệt Phẩm Trang Sức Tinh Tú

LUNA DREAM là thương hiệu trang sức bạc Stellar cao cấp, lấy cảm hứng từ vẻ đẹp huyền bí của mặt trăng, những ngôi sao lấp lánh và các hành tinh trong vũ trụ. Mỗi sản phẩm là một câu chuyện, một bùa hộ mệnh giúp nàng luôn tỏa sáng theo cách riêng của mình.

## Tính Năng Nổi Bật

- **Thiết kế Celestial**: Giao diện mang đậm âm hưởng vũ trụ với tông màu xanh sẫm (Midnight Blue) và vàng (Gold).
- **LUNA DREAM AI**: Chuyên viên tư vấn AI (Gemini) giúp nàng tìm kiếm món trang sức phù hợp nhất.
- **Tìm kiếm thông minh**: Thanh tìm kiếm tích hợp nhanh chóng tại Header.
- **Quản lý toàn diện**: Hệ thống Firebase tích hợp quản lý sản phẩm, đơn hàng và khách hàng.
- **Trải nghiệm mượt mà**: Hiệu ứng chuyển động tinh tế, tối ưu cho cả máy tính và điện thoại.

## Công nghệ sử dụng
- **Frontend:** React + Vite + Tailwind CSS
- **Animation:** Motion (framer-motion legacy)
- **Backend/Database:** Firebase (Authentication, Firestore, Hosting)
- **Icons:** Lucide React

## Hướng dẫn cài đặt và chạy máy local (VS Code)

### 1. Cài đặt các thư viện cần thiết
Mở terminal trong VS Code và chạy lệnh sau:
```bash
npm install
```

### 2. Cấu hình Firebase
Ứng dụng đã được tích hợp sẵn cấu hình Firebase trong file `firebase-applet-config.json` và rules trong `firestore.rules`. 

### 3. Chạy môi trường phát triển
Chạy lệnh sau để khởi động dev server:
```bash
npm run dev
```
Sau đó truy cập vào địa chỉ hiển thị trong terminal (thường là `http://localhost:3000`).

## Hướng dẫn Deploy lên Firebase Hosting

Để đưa website lên internet thông qua Firebase Hosting, hãy thực hiện các bước sau:

1. **Cài đặt Firebase CLI (nếu chưa có):**
   ```bash
   npm install -g firebase-tools
   ```

2. **Đăng nhập vào Firebase:**
   ```bash
   firebase login
   ```

3. **Khởi tạo Hosting (chỉ làm 1 lần):**
   ```bash
   firebase init hosting
   ```
   - Chọn project đã có.
   - Khi được hỏi thư mục nào để deploy, nhập: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds: `No`

4. **Xây dựng bản production:**
   ```bash
   npm run build
   ```

5. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

## Tài khoản Admin mặc định
Để truy cập vào trang quản trị (`/admin`), bạn cần đăng ký một tài khoản và sau đó thủ công cập nhật `role: 'admin'` trong Firestore cho user đó (trong collection `users`).

---
Dự án được thiết kế với sự tỉ mỉ về UI/UX và logic xử lý giỏ hàng, đảm bảo trải nghiệm người dùng tốt nhất.
