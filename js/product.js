// BIẾN DÙNG CHUNG CHO FORM SẢN PHẨM
let productImgBase64 = "";
let editingProductId = null; // Biến lưu ID sản phẩm đang sửa


// ==============================================
// CHỌN ẢNH VÀ LƯU ẢNH XEM TRƯỚC
// ==============================================
const imageInput = document.getElementById("productImageInput");
if (imageInput) {
  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        productImgBase64 = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

// HIỂN THỊ DANH SÁCH SẢN PHẨM CỦA NGƯỜI DÙNG
// Hàm render danh sách sản phẩm (Chỉ hiển thị sản phẩm của tài khoản đang đăng nhập)
function renderManageProducts() {
  const container = document.getElementById("manageProductList");
  if (!container) return;
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let userEmail = currentUser ? currentUser.email : "";
  let products = JSON.parse(localStorage.getItem("products")) || [];
  // Lọc: Chỉ lấy sản phẩm do chính user này đăng (dựa vào email)
  let myProducts = products.filter(p => p.user === userEmail);
  if (myProducts.length === 0) {
    container.innerHTML = `<p style="color: #9ca3af; text-align: center;">Bạn chưa đăng sản phẩm bất động sản nào.</p>`;
    return;
  }
  let html = "";
  myProducts.forEach(p => {
    html += `
      <div class="manage-item" style="display: flex; justify-content: space-between; align-items: center; background-color: #0f1117; border: 1px solid #292e3a; padding: 15px 20px; border-radius: 8px; gap: 15px; margin-bottom: 15px;">
        <div class="manage-item-info" style="display: flex; align-items: center; gap: 15px; flex: 1;">
          <img src="${p.image}" alt="${p.title}" style="width: 60px; height: 60px; border-radius: 6px; object-fit: cover;">
          <div class="manage-item-details">
            <h4 style="color: #ff365e; font-size: 16px; margin-bottom: 4px;">${p.title}</h4>
            <p style="color: #9ca3af; font-size: 13px; margin: 0;">💰 ${p.price} | 📍 ${p.location} | 📐 ${p.area}</p>
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-edit" onclick="startEditProduct(${p.id})" style="background-color: #3b82f6; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">Chỉnh sửa</button>
          <button class="btn-delete" onclick="deleteProduct(${p.id})" style="background-color: #ef4444; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">Xoá</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}


// CHỈNH SỬA SẢN PHẨM
window.startEditProduct = function(productId) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let product = products.find(p => p.id === productId);
  if (!product) return;
  editingProductId = product.id;
  // Điền thông tin cũ vào form
  document.getElementById("title").value = product.title || "";
  document.getElementById("price").value = product.price || "";
  document.getElementById("location").value = product.location || "";
  document.getElementById("area").value = product.area || "";
  document.getElementById("description").value = product.description || "";
  productImgBase64 = product.image || "";
  // Đổi tiêu đề trang thành "Chỉnh sửa Tin Bất Động Sản"
  const pageTitle = document.querySelector(".product-container h2");
  if (pageTitle) {
    pageTitle.innerText = "Chỉnh sửa Tin Bất Động Sản";
  }
  const submitBtn = document.querySelector("#productForm button[type='submit']");
  if (submitBtn) {
    submitBtn.innerText = "Lưu Thay Đổi";
    submitBtn.style.backgroundColor = "#3b82f6";
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// 5. XÓA SẢN PHẨM
window.deleteProduct = function(productId) {
  if (confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products = products.filter(p => p.id !== productId);
    localStorage.setItem("products", JSON.stringify(products));
    if (editingProductId === productId) {
      const form = document.getElementById("productForm");
      if (form) form.reset();
      editingProductId = null;
      productImgBase64 = "";
      const submitBtn = document.querySelector("#productForm button[type='submit']");
      if (submitBtn) {
        submitBtn.innerText = "Đăng Sản Phẩm";
        submitBtn.style.backgroundColor = "#ff365e";
      }
      const pageTitle = document.querySelector(".product-container h2");
      if (pageTitle) {
        pageTitle.innerText = "Đăng Tin Bất Động Sản Mới";
      }
    }
    renderManageProducts();
  }
}


// Xử lý submit form (Thêm mới / Cập nhật)
const form = document.getElementById("productForm");
const submitBtn = form ? form.querySelector("button[type='submit']") : null;
if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let title = document.getElementById("title").value.trim();
    let price = document.getElementById("price").value.trim();
    let location = document.getElementById("location").value.trim();
    let area = document.getElementById("area").value.trim();
    let description = document.getElementById("description").value.trim();
    let error = document.getElementById("Errorsl");
    let pass = document.getElementById("Passsl");
    if (error) error.innerText = "";
    if (pass) pass.innerText = "";
    if (title.length < 5) {
      if (error) error.innerText = "Tên bất động sản phải có ít nhất 5 ký tự.";
      return;
    }
    if (submitBtn) submitBtn.disabled = true;
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let userEmail = currentUser ? currentUser.email : "guest";
    let products = JSON.parse(localStorage.getItem("products")) || [];
    if (editingProductId !== null) {
      let index = products.findIndex(p => p.id === editingProductId);
      if (index !== -1) {
        products[index].title = title;
        products[index].price = price;
        products[index].location = location;
        products[index].area = area;
        products[index].description = description;
        if (productImgBase64) {
          products[index].image = productImgBase64;
        }
      }
      localStorage.setItem("products", JSON.stringify(products));
      if (pass) {
        pass.style.color = "#3b82f6";
        pass.innerText = "Cập nhật sản phẩm thành công!";
      }
    } else {
      let newProduct = {
        id: Date.now(),
        user: userEmail,
        title: title,
        price: price,
        location: location,
        area: area,
        description: description,
        image: productImgBase64 || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"
      };
      products.unshift(newProduct);
      localStorage.setItem("products", JSON.stringify(products));
      if (pass) {
        pass.style.color = "#28a745";
        pass.innerText = "Đăng sản phẩm mới thành công!";
      }
    }
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1500);
    form.reset();
    editingProductId = null;
    productImgBase64 = "";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = "Đăng Sản Phẩm";
      submitBtn.style.backgroundColor = "#ff365e";
    }
    const pageTitle = document.querySelector(".product-container h2");
    if (pageTitle) {
      pageTitle.innerText = "Đăng Tin Bất Động Sản Mới";
    }
    if (pass) pass.innerText = "";
    renderManageProducts();
  });
}


// 7. HIỂN THỊ DANH SÁCH TIN ĐÃ LƯU
async function renderSavedWishlist() {
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
  let defaultProducts = window.globalProperties || [];
  let allAvailableProducts = [...userProducts, ...defaultProducts];
  let html = "";
  savedIds.forEach(id => {
    // So sánh chuỗi linh hoạt để nhận diện chính xác cả sản phẩm có sẵn lẫn sản phẩm tự đăng
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


// XÓA TIN KHỎI DANH SÁCH ĐÃ LƯU
window.removeSavedWishlist = function(productId) {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;
  let storageKey = "wishlist_" + currentUser.email;
  let savedIds = JSON.parse(localStorage.getItem(storageKey)) || [];
  // Lọc bỏ ID (hỗ trợ so sánh cả dạng chuỗi và số)
  savedIds = savedIds.filter(id => String(id) !== String(productId));
  localStorage.setItem(storageKey, JSON.stringify(savedIds));
  renderSavedWishlist();
}


// Gọi hàm render khi trang load xong
document.addEventListener("DOMContentLoaded", function () {
  renderManageProducts();
  renderSavedWishlist();
});