let complaints = [
  {
    id: 1,
    name: "John Doe",
    phone: "03001234567",
    email: "john@gmail.com",
    category: "Billing",
    description: "Incorrect amount charged on the bill.",
    priority: "High",
    status: "New",
    date: "2026-07-30",
  },
  {
    id: 2,
    name: "Sarah Khan",
    phone: "03111234567",
    email: "sarah@gmail.com",
    category: "Technical",
    description: "Internet connection drops every few minutes.",
    priority: "Medium",
    status: "In Progress",
    date: "2026-07-28",
  },
  {
    id: 3,
    name: "Ali Ahmed",
    phone: "03221234567",
    email: "ali@gmail.com",
    category: "Customer Service",
    description: "Support ticket has not received a response.",
    priority: "Low",
    status: "Resolved",
    date: "2026-07-25",
  },
  {
    id: 4,
    name: "Emily Smith",
    phone: "03331234567",
    email: "emily@gmail.com",
    category: "Delivery",
    description: "Package arrived damaged.",
    priority: "High",
    status: "Closed",
    date: "2026-07-20",
  },
];

let editingId = null;

function saveComplaint() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const status = document.getElementById("status").value;
  const date = document.getElementById("date").value;

  if (!name || !phone || !email || !description || !date) {
    alert("Please fill all fields.");
    return;
  }

  if (editingId !== null) {
    const complaint = complaints.find((item) => item.id === editingId);

    if (complaint) {
      complaint.name = name;
      complaint.phone = phone;
      complaint.email = email;
      complaint.category = category;
      complaint.description = description;
      complaint.priority = priority;
      complaint.status = status;
      complaint.date = date;
    }

    editingId = null;
  } else {
    complaints.push({
      id: Date.now(),
      name: name,
      phone: phone,
      email: email,
      category: category,
      description: description,
      priority: priority,
      status: status,
      date: date,
    });
  }

  renderComplaints();
  resetForm();

  const modalElement = document.getElementById("complaintModal");
  const modal = bootstrap.Modal.getInstance(modalElement);

  if (modal) {
    modal.hide();
  }
}

function renderComplaints(searchText = "") {
  const columns = {
    New: document.querySelector(".new-title").closest(".column"),
    "In Progress": document.querySelector(".progress-title").closest(".column"),
    Resolved: document.querySelector(".resolved-title").closest(".column"),
    Closed: document.querySelector(".closed-title").closest(".column"),
  };

  Object.values(columns).forEach((column) => {
    column.querySelectorAll(".complaint-card").forEach((card) => {
      card.remove();
    });
  });

  const search = searchText.toLowerCase();

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.name.toLowerCase().includes(search) ||
      complaint.category.toLowerCase().includes(search) ||
      complaint.description.toLowerCase().includes(search) ||
      complaint.priority.toLowerCase().includes(search) ||
      complaint.status.toLowerCase().includes(search),
  );

  filteredComplaints.forEach((complaint) => {
    const column = columns[complaint.status];

    if (!column) return;

    const card = document.createElement("div");

    card.className = "complaint-card";

    card.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="customer-name">
                        ${complaint.name}
                    </div>

                    <div class="category">
                        ${complaint.category}
                    </div>
                </div>

                <div>
                    <button class="edit-btn" onclick="editComplaint(${complaint.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="delete-btn" onclick="deleteComplaint(${complaint.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>

            <div class="description">
                ${complaint.description}
            </div>

            <span class="priority ${getPriorityClass(complaint.priority)}">
                ${complaint.priority}
            </span>

            <div class="date">
                ${complaint.date}
            </div>
        `;

    column.appendChild(card);
  });

  updateCounts();
}

function getPriorityClass(priority) {
  if (priority === "High") {
    return "high";
  }

  if (priority === "Medium") {
    return "medium";
  }

  if (priority === "Low") {
    return "low";
  }

  return "";
}

function editComplaint(id) {
  const complaint = complaints.find((item) => item.id === id);

  if (!complaint) return;

  editingId = id;

  document.getElementById("customerName").value = complaint.name;
  document.getElementById("phone").value = complaint.phone;
  document.getElementById("email").value = complaint.email;
  document.getElementById("category").value = complaint.category;
  document.getElementById("description").value = complaint.description;
  document.getElementById("priority").value = complaint.priority;
  document.getElementById("status").value = complaint.status;
  document.getElementById("date").value = complaint.date;

  const modalElement = document.getElementById("complaintModal");
  const modal = new bootstrap.Modal(modalElement);

  modal.show();
}

function deleteComplaint(id) {
  const complaint = complaints.find((item) => item.id === id);

  if (!complaint) return;

  if (confirm("Are you sure you want to delete this complaint?")) {
    complaints = complaints.filter((item) => item.id !== id);
    renderComplaints();
  }
}

const searchBox = document.querySelector(".search-box");

if (searchBox) {
  searchBox.addEventListener("input", function () {
    renderComplaints(this.value);
  });
}

function updateCounts() {
  document.querySelector(".new-count").textContent = complaints.filter(
    (item) => item.status === "New",
  ).length;

  document.querySelector(".progress-count").textContent = complaints.filter(
    (item) => item.status === "In Progress",
  ).length;

  document.querySelector(".resolved-count").textContent = complaints.filter(
    (item) => item.status === "Resolved",
  ).length;

  document.querySelector(".closed-count").textContent = complaints.filter(
    (item) => item.status === "Closed",
  ).length;
}

function resetForm() {
  document.getElementById("customerName").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("description").value = "";
  document.getElementById("priority").selectedIndex = 0;
  document.getElementById("status").selectedIndex = 0;
  document.getElementById("date").value = "";

  editingId = null;
}

const complaintModal = document.getElementById("complaintModal");

if (complaintModal) {
  complaintModal.addEventListener("hidden.bs.modal", function () {
    resetForm();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderComplaints();
});

function searchComplaints() {
  const priority = document.getElementById("searchPriority").value;

  const filteredComplaints = complaints.filter(function (complaint) {
    return priority === "" || complaint.priority === priority;
  });

  displayComplaints(filteredComplaints);
}
