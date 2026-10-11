// ==============================================
// HIỂN THỊ VÀ CẬP NHẬT THÔNG TIN TÀI KHOẢN (PROFILE + AVATAR)
document.addEventListener("DOMContentLoaded", function () {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let activeUser = currentUser || (users.length > 0 ? users[0] : null);

  if (activeUser) {
    if (document.getElementById("fullName")) document.getElementById("fullName").value = activeUser.username || activeUser.name || "";
    if (document.getElementById("email")) document.getElementById("email").value = activeUser.email || "";
    if (document.getElementById("phone")) document.getElementById("phone").value = activeUser.phone || "";
    if (document.getElementById("password")) document.getElementById("password").value = activeUser.password || "";
    
    // Hiển thị ảnh đại diện nếu đã có trong dữ liệu
    if (activeUser.avatar && document.getElementById("avatarPreview")) {
      document.getElementById("avatarPreview").src = activeUser.avatar;
    }
  }
});

// Xử lý sự kiện chọn file ảnh để xem trước (Preview)
let avatarBase64 = "";
const avatarInput = document.getElementById("avatarInput");
if (avatarInput) {
  avatarInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        avatarBase64 = event.target.result; // Dữ liệu ảnh dạng chuỗi Base64
        document.getElementById("avatarPreview").src = avatarBase64;
      };
      reader.readAsDataURL(file);
    }
  });
}

const profileForm = document.getElementById("profileForm");
const saveBtn = profileForm ? profileForm.querySelector("button[type='submit']") : null;

if (profileForm) {
  profileForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let username = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : "";
    let password = document.getElementById("password").value.trim();
    
    let error = document.getElementById("Errorsl");
    let pass = document.getElementById("Passsl");

    if (error) error.innerText = "";
    if (pass) pass.innerText = "";

    let lowerCaseLetter = /[a-z]/;
    let upperCaseLetter = /[A-Z]/;
    let numbers = /[0-9]/;

    if (username.length < 6) {
      if (error) error.innerText = "Tên tài khoản phải ít nhất 6 ký tự.";
      return;
    }

    if (password.length < 8) {
      if (error) error.innerText = "Mật khẩu phải ít nhất 8 ký tự.";
      return;
    }
    if (!lowerCaseLetter.test(password)) {
      if (error) error.innerText = "Mật khẩu phải có kí tự viết thường.";
      return;
    }
    if (!upperCaseLetter.test(password)) {
      if (error) error.innerText = "Mật khẩu phải có kí tự viết hoa.";
      return;
    }
    if (!numbers.test(password)) {
      if (error) error.innerText = "Mật khẩu phải có kí tự số.";
      return;
    }
    if (!numbers.test(phone)) {
      if (error) error.innerText = "Số điện thoại phải là số.";
      return;
    }

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let oldEmail = currentUser ? currentUser.email : email;

    let isExist = users.some(function (user) {
      return user.email === email && user.email !== oldEmail;
    });

    if (isExist) {
      if (error) error.innerText = "Email này đã được sử dụng bởi tài khoản khác!";
      return;
    }

    if (saveBtn) saveBtn.disabled = true;

    // Giữ lại avatar cũ nếu người dùng không chọn ảnh mới
    let currentAvatar = currentUser ? currentUser.avatar : "";
    let finalAvatar = avatarBase64 !== "" ? avatarBase64 : currentAvatar;

    let updatedUser = {
      username: username,
      email: email,
      phone: phone,
      password: password,
      avatar: finalAvatar
    };

    let userIndex = users.findIndex(u => u.email === oldEmail);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
    } else {
      users.push(updatedUser);
    }

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("users", JSON.stringify(users));

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    if (pass) {
      pass.style.color = "#28a745";
      pass.innerText = "Cập nhật thông tin thành công!";
    }

    await sleep(2000);

    if (saveBtn) saveBtn.disabled = false;
    if (pass) pass.innerText = "";
  });
}