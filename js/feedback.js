// hàm sleep để tạo độ trễ thời gian
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// XỬ LÝ FORM GỬI PHẢN HỒI
document.addEventListener("DOMContentLoaded", function () {
  const feedbackForm = document.getElementById("feedbackForm");
  const pass = document.getElementById("Passsl"); // Phần tử hiển thị chữ cảm ơn
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (pass) {
        pass.innerText = "Cảm ơn bạn đã đóng góp ý kiến! Đánh giá của bạn đã được ghi nhận.";
      }
      await sleep(3000);
      feedbackForm.reset();
      if (pass) {
        pass.innerText = "";
      }
    });
  }
});