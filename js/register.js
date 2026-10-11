// ==============================================
// ĐĂNG KÝ
const form = document.getElementById("register-form");
const registerBtn = form.querySelector("button[type='submit']"); // Lấy nút submit để vô hiệu hóa khi thành công

// THÊM TỪ KHÓA async Ở ĐÂY 👇
form.addEventListener("submit", async function (event) {
  // 1: Ngăn form reload trang
  event.preventDefault();

  // 2: Lấy username, email, password và dùng trim()
  let username = document.getElementById("username").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let error = document.getElementById("Errorsl");
  let pass = document.getElementById("Passsl"); // Thêm phần tử hiển thị thông báo thành công

  // Xóa các thông báo cũ trước khi kiểm tra mới
  error.innerText = "";
  if (pass) pass.innerText = "";

  let lowerCaseLetter = /[a-z]/;
  let upperCaseLetter = /[A-Z]/;
  let numbers = /[0-9]/;

  // 3: Kiểm tra username tối thiểu 6 ký tự
  if (username.length < 6) {
    error.innerText = "Tài khoản phải ít nhất 6 ký tự.";
    return;
  }

  // 4: Kiểm tra password
  if (password.length < 8) {
    error.innerText = "Mật khẩu phải ít nhất 8 ký tự.";
    return;
  }
  if (!lowerCaseLetter.test(password)) {
    error.innerText = "Mật khẩu phải có kí tự viết thường.";
    return;
  }
  if (!upperCaseLetter.test(password)) {
    error.innerText = "Mật khẩu phải có kí tự viết hoa.";
    return;
  }
  if (!numbers.test(password)) {
    error.innerText = "Mật khẩu phải có kí tự số.";
    return;
  }

  // 5: Lấy mảng users từ LocalStorage. Nếu chưa có thì dùng []
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // 6: Kiểm tra email hoặc username đã tồn tại hay chưa
  let isExist = users.some(function (user) {
    return user.email === email || user.username === username;
  });

  if (isExist) {
    error.innerText = "Email hoặc Tên người dùng đã được sử dụng!"; // Thay alert bằng chữ báo lỗi đỏ
    return;
  }

  // Khóa nút đăng ký lại tạm thời để tránh người dùng nhấn tiếp
  if (registerBtn) registerBtn.disabled = true;

  // 7: Tạo object newUser
  let newUser = {
    username: username,
    email: email,
    password: password
  };

  // 8: Thêm newUser vào users và lưu lại LocalStorage
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Định nghĩa nhanh hàm sleep để dùng độ trễ
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // 9: Thông báo thành công (chữ xanh) & Đợi 3 giây rồi mới chuyển sang login.html
  if (pass) {
    pass.style.color = "#28a745"; // Đổi màu xanh lá cây dịu mắt
    pass.innerText = "Đăng ký thành công! Đang chuyển sang trang đăng nhập sau 3 giây...";
  }

  // SỬ DỤNG await Ở ĐÂY ĐỂ DỪNG 3 GIÂY 👇
  await sleep(3000);

  window.location.href = "./login.html";
});
