let complaints = [
  {
    id: 1,
    name: "John Doe",
    department: "Billing",
    description: "Incorrect amount charged on the latest invoice.",
    priority: "High",
    date: "2026-07-30",
    status: "New",
  },
  {
    id: 2,
    name: "Sarah Khan",
    department: "Technical",
    description: "Internet connection drops several times.",
    priority: "Medium",
    date: "2026-07-28",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Ali Ahmed",
    department: "Customer Service",
    description: "Support ticket has not received response.",
    priority: "Low",
    date: "2026-07-25",
    status: "Resolved",
  },
  {
    id: 4,
    name: "Emily Smith",
    department: "Delivery",
    description: "Package arrived damaged.",
    priority: "High",
    date: "2026-07-20",
    status: "Closed",
  },
];

displayComplaints();

function displayComplaints() {
  document.getElementById("newList").innerHTML = "";
  document.getElementById("progressList").innerHTML = "";
  document.getElementById("resolvedList").innerHTML = "";
  document.getElementById("closedList").innerHTML = "";

  let newCount = 0;
  let progressCount = 0;
  let resolvedCount = 0;
  let closedCount = 0;

  complaints.forEach((item) => {
    let priorityColor = "";

    if (item.priority === "High") {
      priorityColor = "danger";
    } else if (item.priority === "Medium") {
      priorityColor = "warning text-dark";
    } else {
      priorityColor = "success";
    }

    let card = `
        <div class="card shadow-sm mb-3">
            <div class="card-body">

                <div class="d-flex justify-content-between">

                    <h5>${item.name}</h5>

                    <div>
                        <i class="fa-solid fa-pen text-warning me-3"
                           onclick="editComplaint(${item.id})"></i>

                        <i class="fa-solid fa-trash text-danger"
                           onclick="deleteComplaint(${item.id})"></i>
                    </div>

                </div>

                <small class="text-secondary">${item.department}</small>

                <p class="mt-2">${item.description}</p>

                <span class="badge bg-${priorityColor}">
                    ${item.priority}
                </span>

                <div class="text-secondary mt-3">
                    ${item.date}
                </div>

            </div>
        </div>
        `;

    if (item.status === "New") {
      document.getElementById("newList").innerHTML += card;
      newCount++;
    } else if (item.status === "In Progress") {
      document.getElementById("progressList").innerHTML += card;
      progressCount++;
    } else if (item.status === "Resolved") {
      document.getElementById("resolvedList").innerHTML += card;
      resolvedCount++;
    } else if (item.status === "Closed") {
      document.getElementById("closedList").innerHTML += card;
      closedCount++;
    }
  });

  document.getElementById("newCount").innerText = newCount;
  document.getElementById("progressCount").innerText = progressCount;
  document.getElementById("resolvedCount").innerText = resolvedCount;
  document.getElementById("closedCount").innerText = closedCount;
}

function deleteComplaint(id) {
  if (confirm("Delete this complaint?")) {
    complaints = complaints.filter((item) => item.id !== id);

    displayComplaints();
  }
}

function editComplaint(id) {
  let complaint = complaints.find((item) => item.id === id);

  let name = prompt("Customer Name", complaint.name);

  if (name == null) return;

  let department = prompt("Department", complaint.department);

  let description = prompt("Description", complaint.description);

  let priority = prompt("Priority (High/Medium/Low)", complaint.priority);

  let status = prompt(
    "Status (New/In Progress/Resolved/Closed)",
    complaint.status,
  );

  complaint.name = name;
  complaint.department = department;
  complaint.description = description;
  complaint.priority = priority;
  complaint.status = status;

  displayComplaints();
}

function searchComplaint() {
  let value = document.getElementById("search").value.toLowerCase();

  let cards = document.querySelectorAll(".card-body");

  cards.forEach((card) => {
    let text = card.innerText.toLowerCase();

    if (text.includes(value)) {
      card.parentElement.style.display = "";
    } else {
      card.parentElement.style.display = "none";
    }
  });
}

function addComplaint(name, department, description, priority, date, status) {
  complaints.push({
    id: complaints.length + 1,
    name: name,
    department: department,
    description: description,
    priority: priority,
    date: date,
    status: status,
  });

  displayComplaints();
}
