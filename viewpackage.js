const SUPABASE_URL = "https://obnpotxehcktfdcseocz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnBvdHhlaGNrdGZkY3Nlb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjU4NTQsImV4cCI6MjA5Njk0MTg1NH0.ewsB-9T3j1V2BlhaDai9OpIAbPWK6NDQpvPf5SRNFfA";

document.addEventListener("DOMContentLoaded", () => {

    const orderForm = document.getElementById("orderForm");

    if (!orderForm) return;

    orderForm.addEventListener("submit", async (e) => {

        e.preventDefault();

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

        try {

            const res = await fetch(
                `${SUPABASE_URL}/rest/v1/orders?order_id=eq.${orderId}&client_email=eq.${email}`,
                {
                    headers: {
                        apikey: SUPABASE_KEY,
                        Authorization: `Bearer ${SUPABASE_KEY}`
                    }
                }
            );

            const data = await res.json();

            console.log("Order Search:", data);

            if (!data.length) {
                document.getElementById("orderFoundCard").style.display = "none";
                alert("Order not found.");
                return;
            }

            const order = data[0];

            // ================= FIXED LOGIC =================
            const total = Number(order.total_price || 0);
            const depositPaid = order.deposit_paid ? true : false;

            // Example: if deposit is 50%, adjust this later if needed
            const depositAmount = depositPaid ? total * 0.5 : 0;

            const remainingBalance = total - depositAmount;

            // ================= DISPLAY =================
            document.getElementById("foundOrderNumber").textContent =
                order.order_id || "";

            document.getElementById("foundBusinessName").textContent =
                order.business_name || "";

            document.getElementById("foundPackage").textContent =
                order.web_package || "";

            document.getElementById("foundTotalPrice").textContent =
                "$" + total.toFixed(2);

            document.getElementById("foundDepositPaid").textContent =
                depositPaid ? "Paid" : "Not Paid";

            document.getElementById("foundBalance").textContent =
                "$" + remainingBalance.toFixed(2);

            const payButton =
                document.getElementById("payBalanceBtn");

            if (payButton) {
                payButton.href = order.stripe_link || "#";
            }

            document.getElementById("orderFoundCard").style.display =
                "block";

        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }

    });

});
