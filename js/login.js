// KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
if (localStorage.getItem("currentUser")) {
  window.location.href = "./index.html";
}


// Định nghĩa hàm sleep ở ngoài để code sạch hơn
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const form = document.getElementById("login-form");
const loginBtn = form.querySelector("button[type='submit']"); // Lấy nút submit để vô hiệu hóa khi đang xử lý


//XỬ LÝ FORM ĐĂNG NHẬP
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let error = document.getElementById("Errorsl");
  let pass = document.getElementById("Passsl");
  error.innerText = "";
  pass.innerText = "";
  let usersData = localStorage.getItem("users");  // Lấy danh sách users từ LocalStorage 
  if (!usersData) {
    error.innerText = "Chưa có tài khoản nào được đăng ký!";
    return;
  }
  let users = JSON.parse(usersData);
  let existingUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });
  if (!existingUser) {
    error.innerText = "Email hoặc mật khẩu không đúng.";
    return;
  }
  if (loginBtn) loginBtn.disabled = true;// Vô hiệu hóa nút để tránh người dùng nhấn liên tục trong 3 giây đợi
  localStorage.setItem("currentUser", JSON.stringify(existingUser));
  pass.innerText = "Đăng nhập thành công, đang chuyển tới trang chủ...";
  await sleep(3000); 
  window.location.href = "./index.html";
});
