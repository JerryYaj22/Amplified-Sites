document.body.style.display = "none";

/* =========================
   AUTH
========================= */
async function checkAuth() {
    const { data: { session } } =
        await window.supabaseClient.auth.getSession();

    if (!session) {
        window.location.replace("admin-login.html");
        return;
    }

    document.body.style.display = "block";
}
checkAuth();

/* =========================
   LOGOUT
========================= */
document.getElementById("logoutBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    await window.supabaseClient.auth.signOut();
    window.location.replace("admin-login.html");
});

/* =========================
   LOAD ORDERS
========================= */
async function loadOrders() {
    const { data, error } = await window.supabaseClient
        .from("orders")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    renderOrders(data);
}

/* =========================
   RENDER ORDERS (ONLY ONE)
========================= */
function renderOrders(orders) {
    const table = document.getElementById("ordersTable");

    table.innerHTML = orders.map(order => `
        <tr>

            <td>${order.order_id}</td>

            <td><input id="client-${order.order_id}" value="${order.client_name || ""}"></td>
            <td><input id="email-${order.order_id}" value="${order.client_email || ""}"></td>
            <td><input id="phone-${order.order_id}" value="${order.client_phone || ""}"></td>
            <td><input id="business-${order.order_id}" value="${order.business_name || ""}"></td>

            <td>${order.deposit_paid ? "Yes" : "No"}</td>
            <td>${order.fully_paid ? "Yes" : "No"}</td>

            <td>${order.total_price}</td>
            <td>${order.deposit_amount}</td>
            <td>${order.remaining_balance}</td>

            <td>${order.web_package}</td>

            <td>
                <input id="progress-${order.order_id}" value="${order.progress || 0}">
            </td>

            <td>
                <select id="stage-${order.order_id}">
                    <option ${order.stage === "Planning" ? "selected" : ""}>Planning</option>
                    <option ${order.stage === "Design" ? "selected" : ""}>Design</option>
                    <option ${order.stage === "Development" ? "selected" : ""}>Development</option>
                    <option ${order.stage === "Testing" ? "selected" : ""}>Testing</option>
                    <option ${order.stage === "Revisions" ? "selected" : ""}>Revisions</option>
                    <option ${order.stage === "Completed" ? "selected" : ""}>Completed</option>
                </select>
            </td>

            <td>
                <select id="status-${order.order_id}">
                    <option ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option ${order.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option ${order.status === "On Hold" ? "selected" : ""}>On Hold</option>
                    <option ${order.status === "Completed" ? "selected" : ""}>Completed</option>
                </select>
            </td>

            <td>${new Date(order.created_at).toLocaleDateString()}</td>

            <!-- Estimated completion (TEXT) -->
            <td>
                <input type="text"
                    id="est-${order.order_id}"
                    value="${order.estimated_completion || ""}">
            </td>

            <!-- Completion date (TIMESTAMP) -->
            <td>
                <input type="date"
                    id="done-${order.order_id}"
                    value="${order.completion_date ? order.completion_date.split('T')[0] : ""}">
            </td>

            <td>
                <button onclick="saveOrder('${order.order_id}')">Save</button>
            </td>

        </tr>
    `).join("");
}

/* =========================
   SAVE ORDER
========================= */
async function saveOrder(orderId) {

    const updates = {
        client_name: document.getElementById(`client-${orderId}`).value,
        client_email: document.getElementById(`email-${orderId}`).value,
        client_phone: document.getElementById(`phone-${orderId}`).value,
        business_name: document.getElementById(`business-${orderId}`).value,

        progress: Number(document.getElementById(`progress-${orderId}`).value),
        stage: document.getElementById(`stage-${orderId}`).value,
        status: document.getElementById(`status-${orderId}`).value,

        estimated_completion: document.getElementById(`est-${orderId}`).value,

        completion_date: document.getElementById(`done-${orderId}`).value
            ? new Date(document.getElementById(`done-${orderId}`).value).toISOString()
            : null
    };

    const { error } = await window.supabaseClient
        .from("orders")
        .update(updates)
        .eq("order_id", orderId);

    if (error) {
        console.error(error);
        return;
    }

    alert("Order updated!");
    loadOrders();
}

/* =========================
   AUTO LOGOUT TIMER
========================= */
let timeout;

function resetTimer() {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
        await window.supabaseClient.auth.signOut();
        window.location.href = "admin-login.html";
    }, 15 * 60 * 1000);
}

document.addEventListener("mousemove", resetTimer);
document.addEventListener("keydown", resetTimer);
document.addEventListener("click", resetTimer);

resetTimer();

/* =========================
   INIT
========================= */
loadOrders();