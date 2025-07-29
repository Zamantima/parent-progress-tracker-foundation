// Utility: Capitalize
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Map Milestone Index to Name
const milestoneSkillsMap = {
    0: "RoboPet Challenge",
    1: "Scratch Game",
    2: "Line-Following Robot",
    3: "LED Sequencer",
    4: "Interactive Story",
    5: "End-of-Term Showcase"
};

//Seasons descriptions
const seasonDescriptions = {
    SeedSZN: "🌱 Planting the Spark - SeedSZN introduces learners to the world of coding and robotics in a fun, safe, and confidence-building environment. This is where curiosity is planted, and the foundation is laid.",
    CodeSZN: "💻 Think it. Plan it. Code it - CodeSZN focuses on developing logical thinking, computational skills, and digital problem solving using visual programming platforms like Scratch and SPIKE coding blocks.",
    BuildSZN: "🛠️ Invent, Tinker, Engineer - BuildSZN dives into engineering design principles through hands-on building challenges that integrate code, mechanics, and real-world systems.",
    CompeteSZN: "🤖 Challenge Your Skills - CompeteSZN focuses on applying everything learned through timed challenges, creative competitions, and group engineering tasks. Learners are pushed to perform, adapt, and collaborate.",
    MakerSZN: "🧠 Design for Impact - MakerSZN  empowers learners to dream, design, and build meaningful innovations. This is the creative freedom phase where projects are student-driven and often community or future-focused."
};


// Milestone Descriptions
const projectMilestones = [
    "RoboPet Challenge – To introduce students to basic robotics building and programming by designing their own robotic pet. The focus is on mechanical construction, basic motion, sensor input, and sequencing in code.",
    "Scratch Maze Game – Students coded a maze game using loops and motion blocks.",
    "Line-Following Robot – Students built robots that follow paths using light sensors.",
    "LED Sequencer – Students programmed blinking LED patterns using Arduino.",
    "Interactive Story – Learners created interactive animations using Scratch events.",
    "End-of-Term Showcase – Students presented their final creative robotics projects."
];

// Main Dashboard Renderer
function renderDashboard(student) {
    console.log("Loaded student:", student);

    document.getElementById("studentName").textContent = student.name;
    document.getElementById("sessionCount").textContent = student.sessionsRemaining ?? 0;
    document.getElementById("programType").textContent = student.program || "Unknown Program";

    // If the student is in Code Explorers, disable robotics section
    if (student.program === "Code Explorers") {
        const roboticsSection = document.getElementById("roboticsSection");
        roboticsSection.classList.add("disabled");

        const roboticsBody = document.getElementById("roboticsSkillsBody");
        roboticsBody.innerHTML = `
            <tr>
                <td colspan="3">
                <div style="padding: 20px; font-weight: bold; color: #ffc107; background-color: rgba(255, 193, 7, 0.1); border-radius: 10px; text-align: center;">
                    ⚠️ Skills not applicable to this package
                </div>
                </td>
            </tr>
            `;

    }

    const studentPhoto = document.getElementById("studentPhoto");
    studentPhoto.src = student.photo || "images/default-student.png";
    studentPhoto.alt = student.name;

    renderWeeklyReport(student.weeklyReport);
    renderBadges(student.badgesEarned || []);
    renderProjectGallery(student.projectGallery || student.projects || []);

    const milestoneName = milestoneSkillsMap[student.currentMilestoneIndex ?? 0] || "No active milestone";
    document.getElementById("skillFocusTitle").textContent = `🌱 Skill Focus: ${milestoneName}`;
    renderSkillsGrouped(milestoneName, student);

    document.getElementById("instructorNoteText").textContent =
        student.instructorNotes || "No notes available.";

    const nextStepsList = document.getElementById("nextStepsList");
    nextStepsList.innerHTML = "";
    (student.suggestedNextSteps || []).forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        nextStepsList.appendChild(li);
    });

    // Seasonal progress rendering
    renderSeasonalProgress(student);
}

// Render Weekly Report
function renderWeeklyReport(report) {
    if (!report) return;

    document.querySelector(".skills-practiced").innerHTML =
        (report.skillsPracticed || []).map(skill => `<li>${skill}</li>`).join("");

    document.querySelector(".mini-challenges").innerHTML =
        (report.miniChallengesCompleted || []).map(c => `<li>✅ ${c}</li>`).join("");

    const scores = document.querySelectorAll(".score");
    if (scores.length >= 2) {
        scores[0].textContent = `${report.collaborationScore ?? 0}/10`;
        scores[1].textContent = `${report.creativityScore ?? 0}/10`;
    }

    document.getElementById("confidenceBoost").textContent = report.confidenceGrowth || "No update";
}

// Render Badges
function renderBadges(badges = []) {
    const badgeList = document.getElementById("badgeList");
    badgeList.innerHTML = "";

    if (!badges.length) {
        badgeList.innerHTML = "<li>No badges earned yet.</li>";
        return;
    }

    badges.forEach(badge => {
        const li = document.createElement("li");
        li.innerHTML = `${badge.icon || "🏅"} <strong>${badge.name}</strong> — <em>${badge.description}</em>`;
        badgeList.appendChild(li);
    });
}

// Render Project Gallery (Images + Videos)
function renderProjectGallery(projects = []) {
    const galleryContainer = document.getElementById("projectGallery");
    galleryContainer.innerHTML = "";

    projects.forEach(item => {
        const tile = document.createElement("div");
        tile.className = "project-tile";

        const sizeClass = Math.random() > 0.6 ? "tall" : (Math.random() < 0.4 ? "small" : "");
        if (sizeClass) tile.classList.add(sizeClass);

        if (item.type === "video") {
            tile.innerHTML = `
                <div class="image-wrapper">
                    <video autoplay loop muted playsinline>
                        <source src="${item.media}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="project-label">${item.title}</div>
                </div>
            `;
        } else {
            tile.innerHTML = `
                <div class="image-wrapper">
                    <img src="${item.media}" alt="${item.title}" />
                    <div class="project-label">${item.title}</div>
                </div>
            `;
        }

        galleryContainer.appendChild(tile);
    });
}




// Render Skill Breakdown
function renderSkillsGrouped(milestoneName, student) {
    const milestoneKey = Object.keys(student.milestoneProgress || {})
        .find(key => key.trim() === milestoneName.trim());

    if (!milestoneKey) return;
    const milestoneSkills = student.milestoneProgress[milestoneName];
    if (!milestoneSkills) return;

    const codingBody = document.getElementById("codingSkillsBody");
    const roboticsBody = document.getElementById("roboticsSkillsBody");
    codingBody.innerHTML = "";
    roboticsBody.innerHTML = "";

    const explanations = {
        mastered: "Your child has fully grasped this.",
        inProgress: "Currently working on this.",
        notStarted: "This skill has not been introduced."
    };

    for (const category in milestoneSkills) {
        for (const skill in milestoneSkills[category]) {
            const status = milestoneSkills[category][skill];
            const statusIcon = status === "mastered" ? "✅" : status === "inProgress" ? "⏳" : "⚪";
            const explanation = explanations[status];

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><span class="icon">${statusIcon}</span> ${skill}</td>
                <td class="${status}">${capitalize(status)}</td>
                <td>${explanation}</td>
            `;

            if (category.toLowerCase().includes("coding")) {
                codingBody.appendChild(row);
            } else {
                roboticsBody.appendChild(row); // Always show robotics skills
            }

        }
    }
    // If student is in Code Explorers, add the warning message below Robotics table
        if (student.program === "Code Explorers") {
            const warningRow = document.createElement("tr");
            warningRow.innerHTML = `
                <td colspan="3">
                    <div style="margin-top: 10px; font-weight: bold; color: #ffc107; background-color: rgba(255, 193, 7, 0.1); padding: 12px; border-radius: 10px; text-align: center;">
                        ⚠️ Robotics skills shown here are not part of your child’s current package.
                    </div>
                </td>
            `;
            roboticsBody.appendChild(warningRow);
        }

}


// Render Seasonal Progress
function renderSeasonalProgress(student) {
    const seasonOrder = ["SeedSZN", "CodeSZN", "BuildSZN", "CompeteSZN", "MakerSZN"];
    const seasonColors = {
        SeedSZN: "#29f500",
        CodeSZN: "#4CAF50",
        BuildSZN: "#2196F3",
        CompeteSZN: "#03A9F4",
        MakerSZN: "#D3AF37"
    };
    const seasonIcons = {
        SeedSZN: "🌱", CodeSZN: "💻", BuildSZN: "🛠️", CompeteSZN: "🤖", MakerSZN: "🧠"
    };

    const roboticsMilestoneIndexes = [0, 2,5]; // e.g. RoboPet, Line-Following, LED Sequencer
    const isCodeOnly = student.program === "Code Explorers";
    const currentIndex = seasonOrder.indexOf(student.currentSeason);
    const track = document.querySelector(".season-track");
    track.innerHTML = "";

    seasonOrder.forEach((szn, index) => {
        const div = document.createElement("div");
        div.className = "season";
        if (index < currentIndex) {
            div.classList.add("completed");
            div.style.background = seasonColors[szn];
        } else if (index === currentIndex) {
            div.classList.add("current");
            div.style.background = seasonColors[szn];
        } else {
            div.style.background = "#B0B0B0";
        }
        div.innerHTML = `${seasonIcons[szn] || ""}<br>${szn.replace("SZN", "<br>SZN")}`;
        track.appendChild(div);
    });

    const milestoneRow = document.querySelector(".milestones");
    const caption = document.querySelector("#season-caption");
    milestoneRow.innerHTML = "";
    let inProgressShown = false;

    (student.seasonMilestones || []).forEach((status, index) => {
        const dot = document.createElement("div");
        dot.className = "milestone";
        dot.setAttribute("data-index", index);

        const isLocked = isCodeOnly && roboticsMilestoneIndexes.includes(index);

        if (isLocked) {
            dot.innerHTML = "🔒";
            dot.title = "Robotics project – not included in your package.";
            dot.style.opacity = 0.5;
            dot.classList.add("locked");
        } else if (status === "complete") {
            dot.classList.add("complete");
            dot.innerHTML = "✔️";
        } else if (!inProgressShown) {
            dot.classList.add("in-progress");
            dot.innerHTML = "⏳";
            inProgressShown = true;
        }

        milestoneRow.appendChild(dot);
    });

    const completed = (student.seasonMilestones || []).filter(m => m === "complete").length;
    caption.textContent = `${student.currentSeason.replace("SZN", "SZN")} milestone ${completed} of 6`;

    const seasonSummary = document.getElementById("seasonSummary");
    seasonSummary.textContent = seasonDescriptions[student.currentSeason] || "No details available for this season.";

}


// Load data on page ready
document.addEventListener("DOMContentLoaded", function () {
    fetch("students.json")
        .then(response => {
            if (!response.ok) throw new Error("Could not load student data.");
            return response.json();
        })
        .then(students => {
            const token = new URLSearchParams(window.location.search).get("token") || "ZAMA-123";
            const student = students.find(s => s.parentToken === token);

            console.log("Fetched students:", students);
            console.log("Using token:", token);
            console.log("Matched student:", student);

            if (!student) return alert("Student not found.");
            renderDashboard(student);
        })
        .catch(error => {
            console.error("Error loading student data:", error);
            alert("Failed to load student data.");
        });

document.querySelector(".milestones").addEventListener("click", (e) => {
    const bubble = e.target.closest(".milestone");
    if (!bubble) return;

    const isLocked = bubble.classList.contains("locked");
    const index = parseInt(bubble.getAttribute("data-index"));
    const textBox = document.getElementById("projectText");

    const title = projectMilestones[index]?.split("–")[0]?.trim() || "Milestone";
    const description = projectMilestones[index] || "No project details available for this milestone.";

    if (isLocked) {
        textBox.innerHTML = `
            <strong>${title}</strong><br>
            🚫 <em>This milestone includes robotics and is not part of your child’s Code Explorers package.</em>
        `;
        logInteraction?.("Access Denied", `Parent tried to view locked milestone ${index + 1}`, currentStudent);
    } else {
        textBox.textContent = description;
    }
});


});
