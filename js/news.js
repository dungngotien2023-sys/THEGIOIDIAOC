//DỮ LIỆU TIN TỨC
const defaultNewsData = [
  {
    id: 1,
    title: "Thị trường Bất động sản 2026: Phân khúc căn hộ giữ vững đà tăng trưởng",
    description: "Nhờ hạ tầng giao thông đồng bộ và nhu cầu ở thực gia tăng, phân khúc căn hộ tầm trung tiếp tục dẫn đầu thanh khoản thị trường.",
    tag: "Thị trường",
    date: "12/10/2026",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Toàn cảnh thị trường Bất động sản năm 2025: Giai đoạn phục hồi và sàng lọc",
    description: "Năm 2025 chứng kiến sự thanh lọc mạnh mẽ, các dự án có pháp lý minh bạch và chủ đầu tư uy tín thu hút toàn bộ dòng tiền đầu tư.",
    tag: "Tổng kết 2025",
    date: "20/12/2025",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Tác động của Luật Nhà ở và Luật Kinh doanh Bất động sản (sửa đổi) từ năm 2025",
    description: "Những điểm mới quan trọng về điều kiện cấp sổ hồng, bảo lãnh ngân hàng và quy định siết chặt phân lô bán nền bắt đầu có hiệu lực.",
    tag: "Pháp luật",
    date: "15/05/2025",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Xu hướng đầu tư Bất động sản dòng tiền năm 2024: Căn hộ dịch vụ và nhà trọ",
    description: "Khi đất nền vùng ven chững lại, các nhà đầu tư chuyển hướng sang dòng sản phẩm có sẵn khai thác cho thuê để tạo dòng tiền đều đặn.",
    tag: "Đầu tư 2024",
    date: "10/11/2024",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Lãi suất vay mua nhà năm 2024 và bài toán tài chính cho người mua nhà lần đầu",
    description: "Phân tích biến động lãi suất ngân hàng qua các thời kỳ và cách lập kế hoạch tài chính an toàn để tránh áp lực trả nợ.",
    tag: "Tài chính",
    date: "18/06/2024",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Top 5 tiêu chí quan trọng khi lựa chọn mua căn hộ chung cư cao cấp",
    description: "Vị trí địa lý, tiện ích nội khu, uy tín chủ đầu tư và tính pháp lý là những yếu tố quyết định giá trị lâu dài của căn hộ.",
    tag: "Kinh nghiệm",
    date: "08/10/2026",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  }
];


//HIỂN THỊ TIN TỨC LÊN GIAO DIỆN
document.addEventListener("DOMContentLoaded", function () {
  const newsGrid = document.getElementById("newsGrid");

  if (newsGrid) {
    // Render danh sách bài viết ra giao diện
    newsGrid.innerHTML = defaultNewsData.map(news => `
      <article class="news-card">
        <img src="${news.image}" alt="${news.title}" loading="lazy">
        <div class="news-card-body">
          <span class="news-card-tag">${news.tag}</span>
          <h3 class="news-card-title">${news.title}</h3>
          <p class="news-card-desc">${news.description}</p>
          <div class="news-card-footer">
            <span>Đăng ngày: ${news.date}</span>
          </div>
        </div>
      </article>
    `).join('');
  }
});