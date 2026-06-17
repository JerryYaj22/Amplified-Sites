/* =========================
   MOCK PROJECT DATA (OPTIONAL)
========================= */
const projects = {
    "AS-1001": {
        projectType: "Business Website",
        status: "In Progress",
        progress: 0,
        stage: "Development",
        stageNumber: 1,
        completionDate: "June 20, 2026",
        timeRemaining: "31 Days",
        manager: "Amplified Sites",
        updates: [
            "Homepage completed",
            "Contact page completed",
            "Working on Services page"
        ]
    },
    "AS-1002": {
        projectType: "Ecommerce Website",
        status: "Testing",
        progress: 80,
        stage: "Testing",
        stageNumber: 5,
        completionDate: "June 28, 2026",
        timeRemaining: "39 Days",
        manager: "Amplified Sites",
        updates: [
            "Store setup completed",
            "Products uploaded",
            "Testing checkout system"
        ]
    },
    "AS-1003": {
        projectType: "Ecommerce Website",
        status: "Testing",
        progress: 60,
        stage: "Testing",
        stageNumber: 4,
        completionDate: "June 28, 2026",
        timeRemaining: "39 Days",
        manager: "Amplified Sites",
        updates: [
            "Store setup completed",
            "Products uploaded",
            "Testing checkout system"
        ]
    }
};
/* =========================
   CONFIG
========================= */
const SUPABASE_URL = "https://obnpotxehcktfdcseocz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnBvdHhlaGNrdGZkY3Nlb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjU4NTQsImV4cCI6MjA5Njk0MTg1NH0.ewsB-9T3j1V2BlhaDai9OpIAbPWK6NDQpvPf5SRNFfA"; // 🔒 Move to env in production

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
   FETCH PROJECT (SUPABASE)
========================= */
async function fetchProject(orderId) {
    const cleaned = formatOrderId(orderId);

    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/projects?order_id=ilike.*${cleaned}*`,
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

function renderUpdates(updates = []) {
    const list = document.getElementById("updatesList");
    if (!list) return;

    list.innerHTML = "";

    updates.forEach(update => {
        const p = document.createElement("p");
        p.innerHTML = `<i class="fa-solid fa-check"></i> ${update}`;
        list.appendChild(p);
    });
}

function renderStages(stage) {
    const stageMap = {
        Planning: 0,
        Design: 1,
        Development: 2,
        Testing: 3,
        Revisions: 4,
        Complete: 5
    };

    const currentIndex = stageMap[stage] ?? 0;

    document.querySelectorAll(".stage").forEach((el, i) => {
        el.classList.remove("active", "current");
        if (i < currentIndex) el.classList.add("active");
        if (i === currentIndex) el.classList.add("current");
    });
}

/* =========================
   MAIN RENDER
========================= */
function renderProject(project) {
    if (!project) return;

    const dashboard = document.getElementById("dashboard");
    if (dashboard) dashboard.style.display = "block";

    const progress = Number(project.progress) || 0;

    document.getElementById("projectType").innerText = project.package || project.projectType || "";
    document.getElementById("orderNumber").innerText = project.order_id || "";
    document.getElementById("projectStatus").innerText = `● ${project.status || ""}`;
    document.getElementById("progressPercent").innerText = `${progress}%`;
    document.getElementById("currentStage").innerText = project.stage || "";

    document.getElementById("completionDate").innerText = project.completionDate || "";
    document.getElementById("timeRemaining").innerText = project.timeRemaining || "";
    document.getElementById("projectManager").innerText = project.manager || "";

    updateProgressCircle(progress);
    renderUpdates(project.updates);
    renderStages(project.stage);
}

/* =========================
   TRACK BUTTON / SEARCH
========================= */
async function handleTrack() {
    const input = document.getElementById("orderInput");
    if (!input) return;

    const orderId = formatOrderId(input.value);
    if (!orderId) return;

    currentOrderId = orderId;

    const project = await fetchProject(orderId);

    if (!project) {
        alert("Order not found");
        return;
    }

    renderProject(project);
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

    // AUTO LOAD FROM URL (?order=AS-1001)
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
    .channel("projects")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "projects"
        },
        async () => {
            if (!currentOrderId) return;

            const project = await fetchProject(currentOrderId);

            if (project) {
                renderProject(project);
            }
        }
    )
    .subscribe();