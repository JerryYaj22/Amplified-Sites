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

const button = document.getElementById("trackBtn");
const orderInput = document.getElementById("orderInput");

function trackProject() {

    const orderNumber = orderInput.value
        .trim()
        .toUpperCase();

    const project = projects[orderNumber];

    if (!project) {
        alert("Order number not found.");
        return;
    }

    // Project Info
    document.getElementById("projectType").textContent =
        project.projectType;

    document.getElementById("orderNumber").textContent =
        orderNumber;

    document.getElementById("projectStatus").textContent =
        "● " + project.status;

    document.getElementById("progressPercent").textContent =
        project.progress + "%";

    document.getElementById("currentStage").textContent =
        project.stage;

    // Circle Progress
    const circleProgress =
        document.querySelector(".circle-progress");

    circleProgress.style.background =
        `conic-gradient(
            #2563eb 0% ${project.progress}%,
            #03050848 ${project.progress}% 100%
        )`;

    // Project Stages
    const stages = document.querySelectorAll(".stage");

    stages.forEach((stage, index) => {

        stage.classList.remove("active", "current");

        if (index + 1 < project.stageNumber) {
            stage.classList.add("active");
        }

        else if (index + 1 === project.stageNumber) {
            stage.classList.add("current");
        }

    });

    // Stage Numbers
    const nums = document.querySelectorAll(".num");

    nums.forEach((num, index) => {

        num.classList.remove("active", "current");

        if (index + 1 < project.stageNumber) {
            num.classList.add("active");
        }

        else if (index + 1 === project.stageNumber) {
            num.classList.add("current");
        }

    });

    // Stage Labels
    const plans = document.querySelectorAll(".plan");

    plans.forEach((plan, index) => {

        plan.classList.remove("active", "current");

        if (index + 1 < project.stageNumber) {
            plan.classList.add("active");
        }

        else if (index + 1 === project.stageNumber) {
            plan.classList.add("current");
        }

    });

    // Details
    document.getElementById("completionDate").textContent =
        project.completionDate;

    document.getElementById("timeRemaining").textContent =
        project.timeRemaining;

    document.getElementById("projectManager").textContent =
        project.manager;

    // Updates
    const updatesList =
        document.getElementById("updatesList");

    updatesList.innerHTML = "";

    project.updates.forEach(update => {

        const p = document.createElement("p");

        p.innerHTML =
            `<i class="fa-solid fa-check"></i> ${update}`;

        updatesList.appendChild(p);

    });

}

// Button Click
button.addEventListener("click", trackProject);

// Enter Key
orderInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        trackProject();
    }

});
