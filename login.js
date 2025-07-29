   function loginParent() {
      const token = document.getElementById("parentToken").value.trim();
      if (!token) {
        document.getElementById("errorMsg").textContent = "Please enter a token.";
        return;
      }

      fetch("students.json")
        .then(res => res.json())
        .then(students => {
          const student = students.find(s => s.parentToken === token);
          if (!student) {
            document.getElementById("errorMsg").textContent = "Invalid token. Please try again.";
            return;
          }
          window.location.href = `parent.html?token=${token}`;
        })
        .catch(err => {
          console.error("Failed to load student data:", err);
          document.getElementById("errorMsg").textContent = "Error loading student data.";
        });
    }