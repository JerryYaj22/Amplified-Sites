console.log("SUCCESS JS LOADED");
console.log("URL:", window.location.href);
console.log("SCRIPT PATH OK");
document.addEventListener("DOMContentLoaded", async () => {
    const supabaseUrl = "https://obnpotxehcktfdcseocz.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnBvdHhlaGNrdGZkY3Nlb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjU4NTQsImV4cCI6MjA5Njk0MTg1NH0.ewsB-9T3j1V2BlhaDai9OpIAbPWK6NDQpvPf5SRNFfA"; // IMPORTANT: use anon key in frontend
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // 1. GET SESSION ID FROM URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    if (!sessionId) {
        console.error("No session ID found in URL");
        return;
    }

   // 2. FETCH ORDER FROM SUPABASE
console.log("SESSION ID BEING SENT:", sessionId);

const res = await fetch(
  `http://localhost:3000/get-order-by-session?session_id=${sessionId}`
);

const result = await res.json();

console.log("BACKEND RESPONSE:", result);

if (!result.order) {
    console.error("Order not found");
    return;
}

const data = result.order;
// 3. SEND CUSTOMER CONFIRMATION EMAIL
console.log("EMAIL GOING TO:", data.client_email);
emailjs.send(
    "service_lqvhehg",
    "template_z6dzxcr",
    {
        client_name: data.name,
        email: data.client_email,
        order_id: data.order_id,
        package: data.web_package,
        deposit: data.deposit_amount,
        status: data.stage
    }
)
.then(() => {
    console.log("Customer confirmation email sent");
})
.catch((error) => {
    console.error("EmailJS Error:", error);
});
    // 3. POPULATE UI

    // Order number
    document.getElementById("orderNumber").textContent =
        data.order_id || "N/A";

    // Package name
    document.getElementById("packageName").innerHTML =
        `<strong>${data.web_package}</strong>`;

    // Deposit paid
    document.getElementById("depositPaid").innerHTML =
        `<strong>$${data.deposit_amount}</strong>`;
    
        document.getElementById("estimatedCompletion").innerHTML =
    `<strong>${data.estimated_completion}</strong>`;

    // Status (Planning, Design, etc.)
    document.getElementById("projectStatus").innerHTML =
        `<strong>${data.stage}</strong>`;

    // OPTIONAL: track button link
    const trackBtn = document.getElementById("trackBtn");
    if (trackBtn) {
        trackBtn.href = `trackprogress.html?order=${data.order_id}`;
    }

    // COPY BUTTON
    const copyBtn = document.getElementById("copyBtn");

    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(data.order_id);
            copyBtn.textContent = "Copied!";
        });
    }
});
