// ==============================================
// ĐĂNG NHẬP

// 1: Nếu đã có currentUser thì chuyển sang index.html
if (localStorage.getItem("currentUser")) {
  window.location.href = "./index.html";
}

// Định nghĩa hàm sleep ở ngoài để code sạch hơn
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const form = document.getElementById("login-form");
const loginBtn = form.querySelector("button[type='submit']"); // Lấy nút submit để vô hiệu hóa khi đang xử lý

form.addEventListener("submit", async function (event) {
  // 2: Ngăn form reload trang
  event.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let error = document.getElementById("Errorsl");
  let pass = document.getElementById("Passsl");

  // Xóa các thông báo cũ trước khi kiểm tra mới
  error.innerText = "";
  pass.innerText = "";

  // 4: Lấy danh sách users từ LocalStorage (hoặc mảng rỗng nếu chưa có)
  let usersData = localStorage.getItem("users");

  // 5: Nếu chưa có tài khoản nào đăng ký trong hệ thống
  if (!usersData) {
    error.innerText = "Chưa có tài khoản nào được đăng ký!";
    return;
  }
  let users = JSON.parse(usersData);
  // 6: Tìm user có email và password trùng khớp
  let existingUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  // 7: Nếu không tìm thấy, hiển thị thông báo lỗi
  if (!existingUser) {
    error.innerText = "Email hoặc mật khẩu không đúng.";
    return;
  }

  // Vô hiệu hóa nút để tránh người dùng nhấn liên tục trong 3 giây đợi
  if (loginBtn) loginBtn.disabled = true;

  // 8: Lưu tài khoản đăng nhập vào currentUser
  localStorage.setItem("currentUser", JSON.stringify(existingUser));

  // 9: Thông báo & Đợi 3 giây rồi mới chuyển sang index.html
  pass.innerText = "Đăng nhập thành công, đang chuyển tới trang chủ...";
  
  // SỬ DỤNG await Ở ĐÂY ĐỂ DỪNG 3 GIÂY 👇
  await sleep(3000); 
  
  window.location.href = "./index.html";
});
