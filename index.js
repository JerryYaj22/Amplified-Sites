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

const SUPABASE_URL = "https://obnpotxehcktfdcseocz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnBvdHhlaGNrdGZkY3Nlb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjU4NTQsImV4cCI6MjA5Njk0MTg1NH0.ewsB-9T3j1V2BlhaDai9OpIAbPWK6NDQpvPf5SRNFfA";

let currentOrderId = null;

/* =========================
   FETCH PROJECT FROM SUPABASE
========================= */
// FETCH FROM SUPABASE
async function fetchProject(orderId) {

    const cleanedOrderId = orderId.trim().toUpperCase().replace(/\s+/g, "");

    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/projects?order_id=eq.${encodeURIComponent(cleanedOrderId)}`,
        {
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`
            }
        }
    );

    const data = await res.json();

    console.log("Supabase response:", data); // DEBUG (important)

    if (!data.length) {
        console.log("No match found for:", cleanedOrderId);
        alert("No project found");
        return null;
    }

    return data[0];
}

    const data = await res.json();

    if (!data.length) {
        return null;
    }

    return data[0];
}

/* =========================
   RENDER UI
========================= */
function renderProject(project) {

    document.getElementById("dashboard").style.display = "block";

    document.getElementById("projectType").innerText = project.package;
    document.getElementById("orderNumber").innerText = project.order_id;
    document.getElementById("projectStatus").innerText = "● " + project.status;
    document.getElementById("progressPercent").innerText = project.progress + "%";
    document.getElementById("currentStage").innerText = project.status;

    document.getElementById("circleProgress").style.background =
        `conic-gradient(#2563eb ${project.progress}%, #333 ${project.progress}%)`;

    // ✅ FIXED FIELD NAMES
    document.getElementById("completionDate").innerText =
        project.completionDate || "";

    document.getElementById("timeRemaining").innerText =
        project.timeRemaining || "";

    document.getElementById("projectManager").innerText =
        project.manager || "";

    // Updates
    const updatesList = document.getElementById("updatesList");
    updatesList.innerHTML = "";

    (project.updates || []).forEach(update => {
        const p = document.createElement("p");
        p.innerHTML = `<i class="fa-solid fa-check"></i> ${update}`;
        updatesList.appendChild(p);
    });
}

/* =========================
   BUTTON CLICK
========================= */
document.getElementById("trackBtn").addEventListener("click", async () => {

    const orderId = document.getElementById("orderInput").value
        .trim()
        .toUpperCase(); // ✅ DO NOT remove spaces/dashes

    currentOrderId = orderId;

    const project = await fetchProject(orderId);

    if (!project) {
        alert("Order not found");
        return;
    }

    renderProject(project);
});

/* =========================
   REALTIME UPDATES
========================= */
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

supabaseClient
  .channel('projects')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'projects'
  }, async (payload) => {

    console.log("Database changed:", payload);

    if (currentOrderId) {
        const project = await fetchProject(currentOrderId);
        if (project) renderProject(project);
    }
  })
  .subscribe();
