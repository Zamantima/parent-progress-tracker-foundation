 let idCounter = 1;

    function padId(num) {
      return String(num).padStart(3, '0');
    }

    function generateToken(name) {
      const prefix = name.split(" ")[0].toUpperCase();
      const random = Math.floor(100 + Math.random() * 900);
      return `${prefix}-${random}`;
    }

    document.getElementById("name").addEventListener("input", function () {
      const name = this.value.trim();
      if (name.length > 0) {
        document.getElementById("parentToken").value = generateToken(name);
        document.getElementById("id").value = padId(idCounter++);
      }
    });

    let lastStudent = null;

    document.getElementById("studentForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const projectTitles = document.getElementById("projects").value.split(",").map(p => p.trim()).filter(p => p);
      const skills = document.getElementById("skills").value.split(",").map(s => s.trim()).filter(s => s);
      const steps = document.getElementById("nextSteps").value.split(",").map(s => s.trim()).filter(s => s);
      const milestoneStatus = document.getElementById("milestones").value.split(",").map(s => s.trim());

      const student = {
        id: document.getElementById("id").value,
        name: document.getElementById("name").value,
        photo: document.getElementById("photo").value,
        parentName: document.getElementById("parentName").value,
        parentToken: document.getElementById("parentToken").value,
        grade: document.getElementById("grade").value,
        sessionsRemaining: parseInt(document.getElementById("sessionsRemaining").value),
        currentSeason: document.getElementById("currentSeason").value,
        seasonMilestones: milestoneStatus,
        skillProgress: skills,
        weeklyReport: {
          coding: true,
          robotics: true,
          collaboration: parseInt(document.getElementById("collab").value),
          problemSolving: parseInt(document.getElementById("problem").value)
        },
        instructorNotes: document.getElementById("notes").value,
        suggestedNextSteps: steps,
        projects: projectTitles.map(p => ({ title: p, image: "" }))
      };

      lastStudent = student;
      document.getElementById("output").textContent = JSON.stringify(student, null, 2);
    });

    document.getElementById("copyBtn").addEventListener("click", function () {
      const json = document.getElementById("output").textContent;
      navigator.clipboard.writeText(json).then(() => {
        alert("Copied to clipboard!");
      }).catch(() => {
        alert("Failed to copy.");
      });
    });

    document.getElementById("downloadBtn").addEventListener("click", function () {
      if (!lastStudent) return alert("Please generate JSON first.");
      const blob = new Blob([JSON.stringify(lastStudent, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${lastStudent.id}_${lastStudent.name.replace(/\s+/g, '_')}.json`;
      link.click();
    });