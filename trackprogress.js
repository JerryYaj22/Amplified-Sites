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
const SUPABASE_KEY = "YOUR_ANON_KEY";

async function createOrder(orderData) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/projects`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "return=representation"
                },
                body: JSON.stringify({
                    email: orderData.email,
                    business_name: orderData.business_name,
                    package: orderData.package,
                    status: "Pending",
                    progress: 0,
                    stage: "Planning",
                    total_price: orderData.total_price,
                    deposit_paid: orderData.deposit_paid,
                    stripe_link: orderData.stripe_link
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }

        const order = data[0];

        alert(
            `Thank you for your order!\n\nYour Order Number is:\n${order.order_id}`
        );

        console.log("Created Order:", order);

        return order;

    } catch (error) {
        console.error("Order Creation Error:", error);
        alert("Unable to create order.");
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
