let complaints = [];

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
    alert("Please fill name, phone, email, description, and date fields.");
    return;
  }

  const namePattern = /^[A-Za-z ]+$/;
  const phonePattern = /^\+?[0-9- -]+$/;

  if (!namePattern.test(name)) {
    alert("Name can only contain alphabets and spaces.");
    return;
  }

  if (!phonePattern.test(phone)) {
    alert("Phone number can only contain + and digits.");
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

    column.querySelectorAll(".complaint-card").forEach((card) => {
      card.remove();
    });
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
    card.setAttribute("data-id", complaint.id);

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

          <div class="phone">
            <i class="fa-solid fa-phone"></i>
            ${complaint.phone}
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
    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData("text/plain", String(id));
  }
}

function dragEnd(event) {
  event.currentTarget.classList.remove("dragging");

  document.querySelectorAll(".column").forEach((column) => {
    column.classList.remove("drag-over");
  });
}

function allowDrop(event) {
  event.preventDefault();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }

  const column = event.currentTarget;

  column.classList.add("drag-over");
}

function dragLeave(event) {
  const column = event.currentTarget;

  if (!column.contains(event.relatedTarget)) {
    column.classList.remove("drag-over");
  }
}

function dropComplaint(event, newStatus) {
  event.preventDefault();

  const column = event.currentTarget;

  column.classList.remove("drag-over");

  let id = draggedComplaintId;

  if (event.dataTransfer) {
    const dataId = event.dataTransfer.getData("text/plain");

    if (dataId) {
      id = Number(dataId);
    }
  }

  if (!id) {
    return;
  }

  const complaint = complaints.find((item) => item.id === id);

  if (!complaint) {
    return;
  }

  complaint.status = newStatus;

  draggedComplaintId = null;

  const searchValue = complaintSearch ? complaintSearch.value : "";

  renderComplaints(searchValue);
}

function setupDragAndDrop() {
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

  Object.entries(columns).forEach(([status, column]) => {
    if (!column) {
      return;
    }

    column.addEventListener("dragover", allowDrop);

    column.addEventListener("dragleave", dragLeave);

    column.addEventListener("drop", function (event) {
      dropComplaint(event, status);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupDragAndDrop();
  renderComplaints();
});
