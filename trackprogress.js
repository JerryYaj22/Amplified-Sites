/* =========================
   SUPABASE CONFIG
========================= */
const SUPABASE_URL = "https://obnpotxehcktfdcseocz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnBvdHhlaGNrdGZkY3Nlb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjU4NTQsImV4cCI6MjA5Njk0MTg1NH0.ewsB-9T3j1V2BlhaDai9OpIAbPWK6NDQpvPf5SRNFfA"; // keep anon key on frontend ONLY

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentOrderId = null;

/* =========================
   UTILITIES
========================= */
function formatOrderId(orderId) {
    if (!orderId) return null;
    return orderId.trim().toUpperCase().replace(/\s+/g, "");
}

/* =========================
   FETCH ORDER FROM SUPABASE
========================= */
async function fetchOrder(orderId) {
    const cleaned = formatOrderId(orderId);

    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/orders?order_id=eq.${cleaned}`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        const data = await res.json();
        return data.length ? data[0] : null;

    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

/* =========================
   UI HELPERS
========================= */
function updateProgressCircle(progress) {
    const circle = document.getElementById("circleProgress");
    if (!circle) return;

    circle.style.background = `
        conic-gradient(
            #2563eb 0% ${progress}%,
            #03050848 ${progress}% 100%
        )
    `;
}

/* =========================
   MAIN RENDER
========================= */
function renderOrder(order) {
    if (!order) return;

    const dashboard = document.getElementById("dashboard");
    if (dashboard) dashboard.style.display = "block";

    const progress = Number(order.progress) || 0;

    document.getElementById("projectType").innerText = order.web_package || "Website Package";
    document.getElementById("orderNumber").innerText = order.order_id || "";
    document.getElementById("projectStatus").innerText = `● ${order.status || "In Progress"}`;
    document.getElementById("progressPercent").innerText = `${progress}%`;
    document.getElementById("currentStage").innerText = order.stage || "Discover";

    document.getElementById("completionDate").innerText = order.completion_date || "TBD";

    updateProgressCircle(progress);
}

/* =========================
   TRACK ORDER
========================= */
async function handleTrack() {
    const input = document.getElementById("orderInput");
    if (!input) return;

    const orderId = formatOrderId(input.value);
    if (!orderId) return;

    currentOrderId = orderId;

    const order = await fetchOrder(orderId);

    if (!order) {
        alert("Order not found");
        return;
    }

    renderOrder(order);
}

/* =========================
   EVENTS
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("trackBtn");
    const input = document.getElementById("orderInput");

    if (btn) {
        btn.addEventListener("click", handleTrack);
    }

    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleTrack();
        });
    }

    // AUTO LOAD FROM URL (?order=XXXX)
    const params = new URLSearchParams(window.location.search);
    const order = params.get("order");

    if (order) {
        if (input) input.value = order;
        handleTrack();
    }
});

/* =========================
   REALTIME UPDATES
========================= */
supabaseClient
    .channel("orders-updates")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "orders"
        },
        async () => {
            if (!currentOrderId) return;

            const order = await fetchOrder(currentOrderId);

            if (order) {
                renderOrder(order);
            }
        }
    )
    .subscribe();
