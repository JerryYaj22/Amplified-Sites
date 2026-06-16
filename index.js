/* =========================
   CONFIG
========================= */
const SUPABASE_URL = "https://obnpotxehcktfdcseocz.supabase.co";
const SUPABASE_KEY = "YOUR_KEY_HERE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentOrderId = null;

/* =========================
   FETCH PROJECT
========================= */
async function fetchProject(orderId) {
    const cleanedOrderId = orderId.trim().toUpperCase().replace(/\s+/g, "");

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

    if (!data.length) {
        console.log("No match found:", cleanedOrderId);
        return null;
    }

    return data[0];
}

/* =========================
   RENDER PROJECT (UI)
========================= */
function renderProject(project) {

    console.log("progress:", project.progress);

    // Show dashboard
    document.getElementById("dashboard").style.display = "block";

    // Basic info
    document.getElementById("projectType").innerText = project.package;
    document.getElementById("orderNumber").innerText = project.order_id;
    document.getElementById("projectStatus").innerText = "● " + project.status;
    document.getElementById("progressPercent").innerText = project.progress + "%";
    document.getElementById("currentStage").innerText = project.stage;

    // Progress circle
    const progress = Number(project.progress) || 0;
    const circleProgress = document.getElementById("circleProgress");

    circleProgress.style.background = `
        conic-gradient(
            #2563eb 0% ${progress}%,
            #03050848 ${progress}% 100%
        )
    `;

    // Extra details
    document.getElementById("completionDate").innerText = project.completionDate || "";
    document.getElementById("timeRemaining").innerText = project.timeRemaining || "";
    document.getElementById("projectManager").innerText = project.manager || "";

    // Updates list
    const updatesList = document.getElementById("updatesList");
    updatesList.innerHTML = "";

    (project.updates || []).forEach(update => {
        const p = document.createElement("p");
        p.innerHTML = `<i class="fa-solid fa-check"></i> ${update}`;
        updatesList.appendChild(p);
    });

    // Stage progress tracker
    const stageMap = {
        "Planning": 0,
        "Design": 1,
        "Development": 2,
        "Testing": 3,
        "Revisions": 4,
        "Complete": 5
    };

    const currentIndex = stageMap[project.stage] ?? 0;

    const stages = document.querySelectorAll(".stage");
    const nums = document.querySelectorAll(".num");
    const plans = document.querySelectorAll(".plan");

    updateStageUI(stages, currentIndex);
    updateStageUI(nums, currentIndex);
    updateStageUI(plans, currentIndex);
}

/* =========================
   HELPER: UPDATE STAGE UI
========================= */
function updateStageUI(elements, currentIndex) {
    elements.forEach((el, i) => {
        el.classList.remove("active", "current");

        if (i < currentIndex) el.classList.add("active");
        if (i === currentIndex) el.classList.add("current");
    });
}

/* =========================
   HANDLE ORDER LOOKUP
========================= */
async function handleLookup() {
    const orderId = document.getElementById("orderInput").value
        .trim()
        .toUpperCase();

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

// Button click
document.getElementById("trackBtn").addEventListener("click", handleLookup);

// Enter key
document.getElementById("orderInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleLookup();
    }
});

/* =========================
   REALTIME UPDATES
========================= */
supabaseClient
    .channel('projects')
    .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'projects'
        },
        async () => {
            console.log("Database changed");

            if (currentOrderId) {
                const project = await fetchProject(currentOrderId);

                if (project) {
                    renderProject(project);
                }
            }
        }
    )
    .subscribe();
