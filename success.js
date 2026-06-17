document.addEventListener("DOMContentLoaded", () => {
  const orderId = "13E6168C69";

  document.getElementById("trackBtn").href =
    `trackprogress.html?order=${orderId}`;
});
const copyBtn = document.getElementById("copyBtn");
const orderNumber = document.getElementById("orderNumber");

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(orderNumber.textContent.trim());

        copyBtn.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Copied!
        `;

        setTimeout(() => {
            copyBtn.innerHTML = `
                <i class="far fa-copy"></i>
                Copy
            `;
        }, 2000);

    } catch (err) {
        console.error("Failed to copy:", err);
    }
});
