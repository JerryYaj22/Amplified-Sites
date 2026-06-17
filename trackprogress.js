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
const SUPABASE_KEY = "YOUR_KEY_HERE"; // 🔒 Move to env in production

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentOrderId = null;


/* =========================
   UTILITIES
========================= */
function formatOrderId(orderId) {
    return orderId.trim().toUpperCase().replace(/\s+/g, "");
}


/* =========================
   FETCH PROJECT
========================= */
async function fetchProject(orderId) {
    const cleanedOrderId = formatOrderId(orderId);

    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/projects?order_id=ilike.*${cleanedOrderId}*`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        const data = await res.json();

        console.log("Supabase response:", data);

        return data.length ? data[0] : null;

    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}


/* =========================
   RENDER HELPERS
========================= */
function updateProgressCircle(progress) {
    const circle = document.getElementById("circleProgress");

    circle.style.background = `
        conic-gradient(
            #2563eb 0% ${progress}%,
            #03050848 ${progress}% 100%
        )
    `;
}

function renderUpdates(updates = []) {
    const list = document.getElementById("updatesList");
    list.innerHTML = "";

    updates.forEach(update => {
        const p = document.createElement("p");
        p.innerHTML = `<i class="fa-solid fa-check"></i> ${update}`;
        list.appendChild(p);
    });
}

function renderStages(stage) {
    const stageMap = {
        "Planning": 0,
        "Design": 1,
        "Development": 2,
        "Testing": 3,
        "Revisions": 4,
        "Complete": 5
    };

    const currentIndex = stageMap[stage] ?? 0;

    const groups = [
        document.querySelectorAll(".stage"),
        document.querySelectorAll(".num"),
        document.querySelectorAll(".plan")
    ];

    groups.forEach(group => {
        group.forEach((el, i) => {
            el.classList.remove("active", "current");

            if (i < currentIndex) el.classList.add("active");
            if (i === currentIndex) el.classList.add("current");
        });
    });
}


/* =========================
   MAIN RENDER FUNCTION
========================= */
function renderProject(project) {
    if (!project) return;

    document.getElementById("dashboard").style.display = "block";

    const progress = Number(project.progress) || 0;

    // Basic info
    document.getElementById("projectType").innerText = project.package;
    document.getElementById("orderNumber").innerText = project.order_id;
    document.getElementById("projectStatus").innerText = `● ${project.status}`;
    document.getElementById("progressPercent").innerText = `${progress}%`;
    document.getElementById("currentStage").innerText = project.stage;

    // Details
    document.getElementById("completionDate").innerText = project.completionDate || "";
    document.getElementById("timeRemaining").innerText = project.timeRemaining || "";
    document.getElementById("projectManager").innerText = project.manager || "";

    // Sub-renders
    updateProgressCircle(progress);
    renderUpdates(project.updates);
    renderStages(project.stage);
}


/* =========================
   CONTROLLER
========================= */
async function handleTrack() {
    const input = document.getElementById("orderInput").value;
    const orderId = formatOrderId(input);

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
document.getElementById("trackBtn")
    .addEventListener("click", handleTrack);

document.getElementById("orderInput")
    .addEventListener("keydown", (event) => {
        if (event.key === "Enter") handleTrack();
    });


/* =========================
   REALTIME SUBSCRIPTION
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
            console.log("Database changed");

            if (!currentOrderId) return;

            const project = await fetchProject(currentOrderId);

            if (project) {
                renderProject(project);
            }
        }
    )
    .subscribe();
``
