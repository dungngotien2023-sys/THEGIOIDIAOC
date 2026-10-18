// 1. KHAI BÁO FORM VÀ NÚT ĐĂNG KÝ
const form = document.getElementById("register-form");
const registerBtn = form.querySelector("button[type='submit']"); // Lấy nút submit để vô hiệu hóa khi thành công


// 2. XỬ LÝ FORM ĐĂNG KÝ
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  let username = document.getElementById("username").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let error = document.getElementById("Errorsl");
  let pass = document.getElementById("Passsl"); // Thêm phần tử hiển thị thông báo thành công
  error.innerText = "";
  if (pass) pass.innerText = "";
  let lowerCaseLetter = /[a-z]/;
  let upperCaseLetter = /[A-Z]/;
  let numbers = /[0-9]/;
  if (username.length < 6) {
    error.innerText = "Tài khoản phải ít nhất 6 ký tự.";
    return;
  }
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
  let users = JSON.parse(localStorage.getItem("users")) || [];  // Lấy mảng users từ LocalStorage. Nếu chưa có thì dùng []
  let isExist = users.some(function (user) {// Kiểm tra email hoặc username đã tồn tại hay chưa
    return user.email === email || user.username === username;
  });
  if (isExist) {
    error.innerText = "Email hoặc Tên người dùng đã được sử dụng!";
    return;
  }
  // Khóa nút đăng ký lại tạm thời để tránh người dùng nhấn tiếp
  if (registerBtn) registerBtn.disabled = true;
  // Tạo object newUser
  let newUser = {
    username: username,
    email: email,
    password: password
  };
  //Thêm newUser vào users và lưu lại LocalStorage
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  // Định nghĩa nhanh hàm sleep để dùng độ trễ
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  if (pass) {
    pass.style.color = "#28a745"; // Đổi màu xanh lá cây dịu mắt
    pass.innerText = "Đăng ký thành công! Đang chuyển sang trang đăng nhập sau 3 giây...";
  }
  await sleep(3000);
  window.location.href = "./login.html";
});