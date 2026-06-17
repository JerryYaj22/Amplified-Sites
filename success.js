document.addEventListener("DOMContentLoaded", () => {
  const orderId = "2684182520";

  document.getElementById("trackBtn").href =
    `trackprogress.html?order=${orderId}`;
});