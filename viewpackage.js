const SUPABASE_URL = "https://obnpotxehcktfdcseocz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnBvdHhlaGNrdGZkY3Nlb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjU4NTQsImV4cCI6MjA5Njk0MTg1NH0.ewsB-9T3j1V2BlhaDai9OpIAbPWK6NDQpvPf5SRNFfA";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); 
// ===================== PAGE SETUP/EVENT START =====================
document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById("orderForm");
    if (!orderForm) return;
 // ===================== FORM SUBMIT HANDLER =====================
    orderForm.addEventListener("submit", async (e) => {

        e.preventDefault();
 // ===================== USER INPUT COLLECTION=====================
        const orderId = document
            .getElementById("paymentOrderNumber")
            .value
            .trim()
            .toUpperCase();

        const email = document
            .getElementById("paymentEmail")
            .value
            .trim()
            .toLowerCase();
 // ===================== API REQUEST SUPABASE =====================
        try {
            console.log("Searching for:", orderId);
            const { data, error } = await supabaseClient
                .from("orders")
                .select("*")
                .eq("order_id", orderId);
            console.log("Data:", data);
            console.log("Error:", error);
 // ===================== ERROR VALIDATION CHECKS =====================
            if (!data.length) {
                document.getElementById("orderFoundCard").style.display = "none";
                alert("Order not found.");
                return;
            }
            const order = data[0];
            if (
                order.client_email &&
                order.client_email.toLowerCase().trim() !== email
            ) {
                alert("Email does not match this order.");
                return;
            }
 // ===================== DATA PROCESSING NUMBERS =====================
            const total = Number(order.total_price || 0);
            const depositAmount = Number(order.deposit_amount || 0);
            const remainingBalance = Number(order.remaining_balance || 0);
 // ===================== UI DISPLAY RENDER ORDER INFO =====================
            document.getElementById("foundOrderNumber").textContent =
                order.order_id || "";
            document.getElementById("foundBusinessName").textContent =
                order.business_name || "";
            document.getElementById("foundPackage").textContent =
                order.web_package || "";
            document.getElementById("foundTotalPrice").textContent =
                "$" + total.toFixed(2);
            document.getElementById("foundDepositPaid").textContent =
                "$" + depositAmount.toFixed(2);
            document.getElementById("foundBalance").textContent =
                "$" + remainingBalance.toFixed(2);
            document.getElementById("foundOrderDate").textContent =
            new Date(order.created_at).toLocaleDateString("en-US", {
                timeZone: "America/Chicago",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
// ===================== PAYMENT BUTTON LOGIC =====================
            const payButton =
                document.getElementById("payBalanceBtn");
            const paymentStatus =
                document.getElementById("paymentStatus");

 // ===================== PAID/NOT PAID STATE CONTROL =====================
            if (order.fully_paid) {
                document.getElementById("foundBalance").textContent =
                    "$0.00";
                payButton.style.display = "none";
                paymentStatus.textContent =
                    "✅ Order Paid In Full";
            } else {
                payButton.style.display = "inline-flex";
                paymentStatus.textContent = "";
            }
 // ===================== FINAL PAYMENT CLICK STRIPE FLOW=====================            
            if (payButton) {
                payButton.onclick = async (e) => {
                    e.preventDefault();
                    try {
                        const response = await fetch(
                            "http://localhost:3000/create-final-payment-session",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    order_id: order.order_id
                                })
                            }
                        );
                        const session = await response.json();
                        if (!session.url) {
                            alert("Unable to create payment session.");
                            return;
                        }
                        window.location.href = session.url;
 // ===================== ERROR HANDLING =====================
        } catch (err) {
             console.error(err);
             alert("Unable to start payment.");
        }
            };
            }
            document.getElementById("orderFoundCard").style.display =
                "block";
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
    });
});
 // ===================== PACKAGE SELECT SEPERATE FEATURE FROM FIND YOUR ORDER =====================
function selectPackage(packageName, totalPrice, depositAmount, features) {

    console.log("Selected:", packageName, totalPrice, depositAmount, features);

    localStorage.setItem(
        "package_name",
        packageName
    );

    localStorage.setItem(
        "package_price",
        totalPrice
    );

    localStorage.setItem(
        "deposit_amount",
        depositAmount
    );

    localStorage.setItem(
        "package_features",
        JSON.stringify(features)
    );

    window.location.href = "client-info.html";
}