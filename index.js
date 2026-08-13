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
let draggedComplaintId = null;

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

  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
      modal.hide();
    }
  }
}

function renderComplaints(searchText = "") {
  const newTitle = document.querySelector(".new-title");
  const progressTitle = document.querySelector(".progress-title");
  const resolvedTitle = document.querySelector(".resolved-title");
  const closedTitle = document.querySelector(".closed-title");

  const columns = {
    New: newTitle ? newTitle.closest(".column") : null,
    "In Progress": progressTitle ? progressTitle.closest(".column") : null,
    Resolved: resolvedTitle ? resolvedTitle.closest(".column") : null,
    Closed: closedTitle ? closedTitle.closest(".column") : null,
  };

  Object.values(columns).forEach((column) => {
    if (!column) {
      return;
    }

    column.querySelectorAll(".complaint-card").forEach((card) => card.remove());
  });

  const search = searchText.toLowerCase().trim();

  const priorityElement = document.getElementById("searchPriority");

  const selectedPriority = priorityElement ? priorityElement.value : "";

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.name.toLowerCase().includes(search) ||
      complaint.phone.toLowerCase().includes(search) ||
      complaint.email.toLowerCase().includes(search) ||
      complaint.category.toLowerCase().includes(search) ||
      complaint.description.toLowerCase().includes(search) ||
      complaint.priority.toLowerCase().includes(search) ||
      complaint.status.toLowerCase().includes(search);

    const matchesPriority =
      selectedPriority === "" || complaint.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  filteredComplaints.forEach((complaint) => {
    const column = columns[complaint.status];

    if (!column) {
      return;
    }

    const card = document.createElement("div");

    card.className = "complaint-card";

    card.setAttribute("draggable", "true");

    card.addEventListener("dragstart", function (event) {
      dragStart(event, complaint.id);
    });

    card.addEventListener("dragend", function (event) {
      dragEnd(event);
    });

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

                    <button
                        class="edit-btn"
                        onclick="editComplaint(${complaint.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteComplaint(${complaint.id})">
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

  if (!complaint) {
    return;
  }

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

  if (modalElement) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.show();
  }
}

function deleteComplaint(id) {
  const complaint = complaints.find((item) => item.id === id);

  if (!complaint) {
    return;
  }

  const confirmDelete = confirm(
    "Are you sure you want to delete this complaint?",
  );

  if (confirmDelete) {
    complaints = complaints.filter((item) => item.id !== id);

    renderComplaints();
  }
}

function updateCounts() {
  const newCount = document.querySelector(".new-count");

  const progressCount = document.querySelector(".progress-count");

  const resolvedCount = document.querySelector(".resolved-count");

  const closedCount = document.querySelector(".closed-count");

  if (newCount) {
    newCount.textContent = complaints.filter(
      (item) => item.status === "New",
    ).length;
  }

  if (progressCount) {
    progressCount.textContent = complaints.filter(
      (item) => item.status === "In Progress",
    ).length;
  }

  if (resolvedCount) {
    resolvedCount.textContent = complaints.filter(
      (item) => item.status === "Resolved",
    ).length;
  }

  if (closedCount) {
    closedCount.textContent = complaints.filter(
      (item) => item.status === "Closed",
    ).length;
  }
}

function resetForm() {
  const customerName = document.getElementById("customerName");

  const phone = document.getElementById("phone");

  const email = document.getElementById("email");

  const category = document.getElementById("category");

  const description = document.getElementById("description");

  const priority = document.getElementById("priority");

  const status = document.getElementById("status");

  const date = document.getElementById("date");

  if (customerName) {
    customerName.value = "";
  }

  if (phone) {
    phone.value = "";
  }

  if (email) {
    email.value = "";
  }

  if (category) {
    category.selectedIndex = 0;
  }

  if (description) {
    description.value = "";
  }

  if (priority) {
    priority.selectedIndex = 0;
  }

  if (status) {
    status.selectedIndex = 0;
  }

  if (date) {
    date.value = "";
  }

  editingId = null;
}

const complaintSearch = document.getElementById("complaintSearch");

const searchPriority = document.getElementById("searchPriority");

if (complaintSearch) {
  complaintSearch.addEventListener("input", function () {
    renderComplaints(this.value);
  });
}

if (searchPriority) {
  searchPriority.addEventListener("change", function () {
    renderComplaints(complaintSearch ? complaintSearch.value : "");
  });
}

function searchComplaints() {
  const search = complaintSearch ? complaintSearch.value : "";

  renderComplaints(search);
}

const complaintModal = document.getElementById("complaintModal");

if (complaintModal) {
  complaintModal.addEventListener("hidden.bs.modal", function () {
    resetForm();
  });
}

function dragStart(event, id) {
  draggedComplaintId = id;

  event.currentTarget.classList.add("dragging");

  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", id);
  }
}

function dragEnd(event) {
  event.currentTarget.classList.remove("dragging");

  draggedComplaintId = null;
}

document.addEventListener("DOMContentLoaded", function () {
  renderComplaints();
});
