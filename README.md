# MÂY CREATIVE STUDIO — AI PRODUCT IMAGE STUDIO

Hệ thống AI chuẩn hóa và nâng tầm hình ảnh sản phẩm mỹ phẩm cao cấp (Quiet Luxury Commercial AI Studio).

---

## 🌐 Đường Dẫn Sản Phẩm Trực Tiếp (Live Cloud Run)

👉 **[https://may-image-studio-127734017658.asia-southeast1.run.app](https://may-image-studio-127734017658.asia-southeast1.run.app)**

---

## 🚀 Hướng Dẫn Khởi Chạy Nhanh (Quick Start)

Lưu ý: Mở terminal tại thư mục gốc của dự án (`may app final`):

```bash
# 1. Cài đặt dependencies (nếu chưa cài)
npm install

# 2. Khởi chạy máy chủ phát triển (Dev Server)
npm run dev
# hoặc
npm start

# -> Mở trình duyệt tại: http://localhost:5173/
```

### Các Lệnh Quan Trọng Khác

```bash
# Kiểm tra cú pháp và chất lượng mã nguồn (0 lỗi, 0 cảnh báo)
npm run lint

# Đóng gói bản Production (Vite build)
npm run build

# Xem thử bản Production cục bộ
npm run preview

# Triển khai tự động lên Google Cloud Run
deploy-cloudrun.bat
```

---

## 💎 Điểm Nhấn Kiến Trúc & Trải Nghiệm (UX Standards)

- **User-Result-First**: Quy trình tối giản `Upload` → `AI Chẩn đoán` → `Best Next Action` → `Xem trước Split (Preview)` → `Áp dụng (Apply)` → `Xuất 4K`.
- **P0 Preview Architecture (`previewImage ≠ committedImage`)**:
  - Bản xem trước AI lưu riêng vào lớp `previewImg`, tuyệt đối không làm mất ảnh gốc hoặc ảnh đã lưu.
  - Thanh trượt so sánh trực quan `BEFORE ◀───────●───────▶ AFTER`.
  - Quyền cam kết thuộc về người dùng qua thanh nổi `[Hủy]` và `[Áp dụng]`.
- **Thẩm mỹ Soft Luxury**: Bảng màu Silk Rose (`#FDF9F7`, `#FCEEEA`, `#B76E79`, `#8C4752`), typography Playfair Display kết hợp Inter.
- **Bảo Toàn Nhãn 100%**: Nhận diện vùng in chữ và logo kim loại, bảo vệ 100% chống biến dạng.
