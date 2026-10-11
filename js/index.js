// ==============================================
// 1. BIẾN TOÀN CỤC & KHỞI TẠO LOCALSTORAGE
let globalProperties = [];

// Lấy sản phẩm do user đăng từ localStorage đưa vào globalProperties
let initialLocalProducts = JSON.parse(localStorage.getItem("products")) || [];
initialLocalProducts.forEach(p => globalProperties.push(p));


// ==============================================
// 2. KIỂM TRA ĐĂNG NHẬP & XỬ LÝ ĐĂNG XUẤT
let currentUserData = localStorage.getItem("currentUser");

if (!currentUserData) {
  window.location.href = "./login.html";
} else {
  let currentUser = JSON.parse(currentUserData);
  const welcomeText = document.getElementById("welcome-text");
  if (welcomeText) {
    welcomeText.innerText = `Xin chào, ${currentUser.username || "Bạn"}!`;
  }
}

const logoutBtn = document.getElementById("logout-btn") || document.querySelector(".logout-item");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}


// ==============================================
// 3. XỬ LÝ MODAL CHI TIẾT SẢN PHẨM & LƯU TIN
function openDetailModal(productId) {
  const modal = document.getElementById("product-modal");
  const modalBody = document.getElementById("modal-body");

  if (!modal || !modalBody) return;

  const item = globalProperties.find((p) => p.id === Number(productId) || p.id === productId);
  if (!item) {
    alert("Không tìm thấy thông tin sản phẩm!");
    return;
  }

  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  let userEmail = currentUser.email || "guest";
  let savedWishlist = JSON.parse(localStorage.getItem("wishlist_" + userEmail)) || [];
  let isSaved = savedWishlist.includes(item.id) || savedWishlist.includes(String(item.id));

  modalBody.innerHTML = `
    <div class="modal-grid">
      <div class="modal-img-wrapper">
        <img src="${item.image}" alt="${item.title}" class="modal-img" />
      </div>
      <div class="modal-info">
        <h2>${item.title}</h2>
        <p class="modal-price">💰 Giá bán: <strong>${item.price}</strong></p>
        <p class="modal-location">📍 Vị trí: <strong>${item.location}</strong></p>
        <p class="modal-area">📐 Diện tích: <strong>${item.area}</strong></p>
        <hr class="modal-divider" />
        <h4>Mô tả chi tiết:</h4>
        <p class="modal-desc">${item.description}</p>
        <div style="display: flex; gap: 10px; margin-top: 15px;">
          <button class="btn-contact" onclick="alert('Đã gửi yêu cầu tư vấn thành công!')" style="flex: 1;">Liên hệ tư vấn ngay</button>
          <button id="btnSaveWishlist" onclick="toggleSaveWishlist(${item.id})" style="background-color: ${isSaved ? '#ef4444' : '#374151'}; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.2s;">
            ${isSaved ? '❤️ Đã lưu' : '🤍 Lưu tin'}
          </button>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

window.toggleSaveWishlist = function(productId) {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Vui lòng đăng nhập để lưu tin!");
    return;
  }
  let userEmail = currentUser.email;
  let storageKey = "wishlist_" + userEmail;
  let savedWishlist = JSON.parse(localStorage.getItem(storageKey)) || [];

  let index = savedWishlist.findIndex(id => String(id) === String(productId));
  const btn = document.getElementById("btnSaveWishlist");

  if (index > -1) {
    savedWishlist.splice(index, 1);
    if (btn) {
      btn.style.backgroundColor = "#374151";
      btn.innerText = "🤍 Lưu tin";
    }
  } else {
    savedWishlist.push(productId);
    if (btn) {
      btn.style.backgroundColor = "#ef4444";
      btn.innerText = "❤️ Đã lưu";
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(savedWishlist));
  
  // Cập nhật lại giao diện danh sách lưu nếu đang ở trang đó
  if (typeof renderSavedWishlist === "function") {
    renderSavedWishlist();
  }
}

function closeModal() {
  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const closeModalBtn = document.getElementById("close-modal");
  const modal = document.getElementById("product-modal");

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }
});


// ==============================================
// 4. HIỂN THỊ AVATAR & DROPDOWN MENU
document.addEventListener("DOMContentLoaded", function () {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let headerAvatarImg = document.getElementById("headerAvatarImg");

  if (currentUser && currentUser.avatar && headerAvatarImg) {
    headerAvatarImg.src = currentUser.avatar;
  }

  const avatarBtn = document.getElementById("avatarMenuBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (avatarBtn && dropdownMenu) {
    avatarBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function () {
      if (dropdownMenu.classList.contains("show")) {
        dropdownMenu.classList.remove("show");
      }
    });
  }
});


// ==============================================
// 5. RENDER SẢN PHẨM MỚI TỪ LOCALSTORAGE (QUẢN LÝ BÀI ĐĂNG)
document.addEventListener("DOMContentLoaded", function () {
  const productListContainer = document.getElementById("productList");
  
  if (productListContainer) {
    let localProducts = JSON.parse(localStorage.getItem("products")) || [];

    if (localProducts.length === 0) {
      productListContainer.innerHTML = `<p style="color: #9ca3af; grid-column: 1/-1;">Chưa có sản phẩm bất động sản nào được đăng.</p>`;
      return;
    }

    let html = "";
    localProducts.forEach((item) => {
      html += `
        <article class="property-card" onclick="openDetailModal(${item.id})">
          <div class="img-box">
            <img class="property-img" src="${item.image}" alt="${item.title}" loading="lazy" />
          </div>
          <div class="property-info">
            <h3 class="property-title" title="${item.title}">${item.title}</h3>
            <p class="property-location">📍 ${item.location}</p>
            <div class="property-details">
              <span class="property-price">${item.price}</span>
              <span class="property-area">📐 ${item.area}</span>
            </div>
            <button class="btn-detail" onclick="event.stopPropagation(); openDetailModal(${item.id})">Xem chi tiết</button>
          </div>
        </article>
      `;
    });

    productListContainer.innerHTML = html;
  }
});


// ==============================================
// 6. DỮ LIỆU BĐS CÓ SẴN & TÍNH NĂNG LỌC/TÌM KIẾM
const defaultProductsData = [
  { id: 1, title: "Căn hộ cao cấp Vinhomes Central Park", location: "Bình Thạnh, TP. Hồ Chí Minh", price: "4.8 Tỷ", area: "78 m²", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600", description: "Căn hộ thiết kế hiện đại 2 phòng ngủ, bàn giao nội thất cao cấp. Tọa lạc tại vị trí đắc địa ven sông Sài Gòn, sở hữu tầm nhìn thoáng đãng và tích hợp đầy đủ tiện ích chuẩn 5 sao như công viên 14 ha, bệnh viện Vinmec, trường học Vinschool." },
  { id: 2, title: "Biệt thự sân vườn Thảo Điền", location: "Thành phố Thủ Đức, TP.HCM", price: "32 Tỷ", area: "280 m²", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600", description: "Biệt thự đơn lập phong cách châu Âu sang trọng, trang bị hồ bơi riêng và sân vườn xanh mát. Khu vực an ninh 24/7, dân trí cao, gần các trường quốc tế uy tín, phù hợp cho gia đình thượng lưu hoặc chuyên gia nước ngoài sinh sống." },
  { id: 3, title: "Nhà phố thương mại Shophouse Phú Mỹ Hưng", location: "Quận 7, TP. Hồ Chí Minh", price: "15.5 Tỷ", area: "120 m²", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",description: "Shophouse mặt tiền tuyến đường sầm uất tại trung tâm Phú Mỹ Hưng, thiết kế 1 trệt 3 lầu tối ưu cho việc vừa ở vừa kinh doanh hoặc cho thuê văn phòng. Tiềm năng tăng giá và dòng tiền cho thuê ổn định."},
  { id: 4, title: "Căn hộ Studio Vinhomes Ocean Park", location: "Gia Lâm, Hà Nội", price: "1.9 Tỷ", area: "38 m²", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600", description: "Căn hộ Studio thông minh tối ưu không gian sử dụng, nằm trong đại đô thị biển hồ nhân tạo. Phù hợp cho người trẻ năng động, vợ chồng mới cưới hoặc nhà đầu tư khai thác cho thuê homestay." },
  { id: 5, title: "Đất nền ven biển Mỹ Khê", location: "Sơn Trà, Đà Nẵng", price: "5.2 Tỷ", area: "100 m²", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600", description: "Lô đất đẹp vuông vức cách bãi biển Mỹ Khê chỉ vài phút đi bộ. Cơ sở hạ tầng hoàn thiện, giao thông thuận tiện, thích hợp xây dựng khách sạn, nhà hàng hoặc villa nghỉ dưỡng kinh doanh du lịch." },
  { id: 6, title: "Penthouse Sky Villa view sông Sài Gòn", location: "Quận 1, TP. Hồ Chí Minh", price: "58 Tỷ", area: "350 m²", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600", description: "Siêu phẩm Penthouse tầm nhìn 360 độ ôm trọn toàn cảnh sông Sài Gòn và trung tâm Quận 1. Thiết kế thông tầng đằng cấp, trang bị hồ bơi vô cực riêng và sân vườn trên không độc bản." },
  { id: 7, title: "Nhà liền kề Gamuda Gardens", location: "Hoàng Mai, Hà Nội", price: "9.8 Tỷ", area: "115 m²", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600", description: "Nhà liền kề xây dựng 4 tầng kiến trúc hiện đại, nằm trong khu đô thị sinh thái khép kín. Không gian sống xanh, sạch, yên tĩnh với đầy đủ tiện ích như câu lạc bộ, bể bơi, khu thể thao ngoài trời." },
  { id: 8, title: "Căn hộ chung cư Masteri Thảo Điền", location: "Thành phố Thủ Đức, TP.HCM", price: "3.9 Tỷ", area: "68 m²", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600", description: "Căn hộ 2 phòng ngủ tầng cao view đẹp, kết nối trực tiếp với nhà ga tàu điện Metro Bến Thành - Suối Tiên và trung tâm thương mại Vincom Mega Mall. Tiện ích nội khu đa dạng, pháp lý hoàn chỉnh." },
  { id: 9, title: "Villa nghỉ dưỡng đồi An Sơn", location: "Thành phố Đà Lạt, Lâm Đồng", price: "18 Tỷ", area: "220 m²", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600", description: "Biệt thự nghỉ dưỡng lưng tựa đồi mặt hướng thung lũng thông reo. Thiết kế mộc mạc tinh tế kết hợp không gian mở gần gũi với thiên nhiên, khí hậu mát mẻ quanh năm, lý tưởng để nghỉ dưỡng cùng gia đình." },
  { id: 10, title: "Căn hộ Duplex Sunshine City", location: "Bắc Từ Liêm, Hà Nội", price: "6.5 Tỷ", area: "140 m²", image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600", description: "Căn hộ Duplex thông tầng rộng rãi, thiết kế kính Panorama phủ từ sàn đến trần giúp đón trọn ánh sáng tự nhiên. Trang bị hệ thống Smart Home thông minh và nội thất mạ vàng sang trọng." },
  { id: 11, title: "Shophouse Sun Grand City", location: "Thành phố Hạ Long, Quảng Ninh", price: "11.2 Tỷ", area: "105 m²", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600", description: "Shophouse nằm trên đường bờ biển bãi Cháy, vị trí vàng đón lượng lớn khách du lịch. Thích hợp kinh doanh khách sạn boutique, nhà hàng, quán cafe hoặc spa cao cấp." },
  { id: 12, title: "Nhà phố mặt tiền đường Lê Văn Sỹ", location: "Quận 3, TP. Hồ Chí Minh", price: "21 Tỷ", area: "90 m²", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600", description: "Nhà phố đắc địa mặt tiền tuyến đường thời trang và ẩm thực sầm uất bậc nhất Quận 3. Kết cấu 1 trệt 3 lầu cứng cáp, hiện đang có hợp đồng cho thuê thương hiệu thời trang với thu nhập cao."}
];

// Nạp các sản phẩm có sẵn vào globalProperties để Modal nhận diện
defaultProductsData.forEach(item => {
  if (!globalProperties.some(p => p.id === item.id)) {
    globalProperties.push(item);
  }
});

function filterDefaultProducts() {
  const searchInput = document.getElementById("searchKeyword");
  const typeSelect = document.getElementById("filterType");
  const priceSelect = document.getElementById("filterPrice");

  if (!searchInput) return;

  const keyword = searchInput.value.toLowerCase().trim();
  const selectedType = typeSelect ? typeSelect.value.toLowerCase() : "";
  const priceRange = priceSelect ? priceSelect.value : "";

  const filtered = defaultProductsData.filter(item => {
    const matchKeyword = item.title.toLowerCase().includes(keyword) || item.location.toLowerCase().includes(keyword);
    const matchType = selectedType === "" || item.title.toLowerCase().includes(selectedType);

    let priceNum = parseFloat(item.price);
    let matchPrice = true;
    if (priceRange === "under_3") {
      matchPrice = priceNum < 3;
    } else if (priceRange === "3_10") {
      matchPrice = priceNum >= 3 && priceNum <= 10;
    } else if (priceRange === "over_10") {
      matchPrice = priceNum > 10;
    }

    return matchKeyword && matchType && matchPrice;
  });

  renderFilteredDefaultGrid(filtered);
}

function renderFilteredDefaultGrid(products) {
  const container = document.getElementById("property-container");
  const loadingElement = document.getElementById("loading");

  if (loadingElement) loadingElement.style.display = "none";
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `<p style="color: #9ca3af; text-align: center; width: 100%; grid-column: 1 / -1;">Không tìm thấy bất động sản phù hợp.</p>`;
    return;
  }

  let html = "";
  products.forEach((item) => {
    html += `
      <article class="property-card" onclick="openDetailModal(${item.id})">
        <div class="img-box">
          <img class="property-img" src="${item.image}" alt="${item.title}" loading="lazy" />
        </div>
        <div class="property-info">
          <h3 class="property-title" title="${item.title}">${item.title}</h3>
          <p class="property-location">📍 ${item.location}</p>
          <div class="property-details">
            <span class="property-price">${item.price}</span>
            <span class="property-area">📐 ${item.area}</span>
          </div>
          <button class="btn-detail" onclick="event.stopPropagation(); openDetailModal(${item.id})">Xem chi tiết</button>
        </div>
      </article>
    `;
  });
  container.innerHTML = html;
}


// ==============================================
// 7. RENDER & QUẢN LÝ DANH SÁCH TIN ĐÃ LƯU (WISHLIST)
function renderSavedWishlist() {
  const container = document.getElementById("savedWishlistContainer");
  if (!container) return;

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  let userEmail = currentUser.email;
  let savedIds = JSON.parse(localStorage.getItem("wishlist_" + userEmail)) || [];

  if (savedIds.length === 0) {
    container.innerHTML = `<p style="color: #9ca3af; text-align: center;">Chưa có tin bất động sản nào được lưu.</p>`;
    return;
  }

  let userProducts = JSON.parse(localStorage.getItem("products")) || [];
  let allAvailableProducts = [...userProducts, ...defaultProductsData];
  
  let html = "";
  savedIds.forEach(id => {
    let p = allAvailableProducts.find(item => String(item.id) === String(id));
    if (p) {
      html += `
        <div class="manage-item" style="display: flex; justify-content: space-between; align-items: center; background-color: #0f1117; border: 1px solid #292e3a; padding: 15px 20px; border-radius: 8px; gap: 15px; margin-bottom: 15px;">
          <div class="manage-item-info" style="display: flex; align-items: center; gap: 15px; flex: 1;">
            <img src="${p.image}" alt="${p.title}" style="width: 60px; height: 60px; border-radius: 6px; object-fit: cover;">
            <div class="manage-item-details">
              <h4 style="color: #ff365e; font-size: 16px; margin-bottom: 4px;">${p.title}</h4>
              <p style="color: #9ca3af; font-size: 13px; margin: 0;">💰 ${p.price} | 📍 ${p.location} | 📐 ${p.area}</p>
            </div>
          </div>
          <div>
            <button class="btn-delete-saved" onclick="removeSavedWishlist('${p.id}')" style="background-color: #ef4444; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">Xoá tin lưu</button>
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = html || `<p style="color: #9ca3af; text-align: center;">Chưa có tin bất động sản nào được lưu.</p>`;
}

window.removeSavedWishlist = function(productId) {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  let storageKey = "wishlist_" + currentUser.email;
  let savedIds = JSON.parse(localStorage.getItem(storageKey)) || [];

  savedIds = savedIds.filter(id => String(id) !== String(productId));
  localStorage.setItem(storageKey, JSON.stringify(savedIds));

  renderSavedWishlist();
}


// ==============================================
// 8. KHỞI CHẠY KHI TẢI TRANG
document.addEventListener("DOMContentLoaded", function () {
  // Render BĐS có sẵn ban đầu
  renderFilteredDefaultGrid(defaultProductsData);

  // Render danh sách tin đã lưu
  renderSavedWishlist();

  // Lắng nghe sự kiện tìm kiếm & lọc
  const searchInput = document.getElementById("searchKeyword");
  const typeSelect = document.getElementById("filterType");
  const priceSelect = document.getElementById("filterPrice");

  if (searchInput) searchInput.addEventListener("input", filterDefaultProducts);
  if (typeSelect) typeSelect.addEventListener("change", filterDefaultProducts);
  if (priceSelect) priceSelect.addEventListener("change", filterDefaultProducts);
});