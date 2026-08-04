let complaints = [];

function saveComplaint() {
  const customerName = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const status = document.getElementById("status").value;
  const date = document.getElementById("date").value;

  if (
    customerName === "" ||
    phone === "" ||
    email === "" ||
    description === "" ||
    date === ""
  ) {
    alert("Please fill all fields.");
    return;
  }

  const complaint = {
    id: Date.now(),
    customerName,
    phone,
    email,
    category,
    description,
    priority,
    status,
    date,
  };

  complaints.push(complaint);

  displayComplaints();

  document.getElementById("customerName").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("priority").selectedIndex = 0;
  document.getElementById("status").selectedIndex = 0;

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("complaintModal"),
  );
  modal.hide();
}

function displayComplaints() {
  const columns = document.querySelectorAll(".bg-light.rounded.shadow-sm");

  columns.forEach((column) => {
    const cards = column.querySelectorAll(".complaint-card");
    cards.forEach((card) => card.remove());
  });

  complaints.forEach((c) => {
    let column;

    if (c.status === "New") {
      column = columns[0];
    } else if (c.status === "In Progress") {
      column = columns[1];
    } else if (c.status === "Resolved") {
      column = columns[2];
    } else {
      column = columns[3];
    }

    const card = document.createElement("div");
    card.className = "complaint-card card m-2 shadow-sm";

    let priorityColor = "success";

    if (c.priority === "High") {
      priorityColor = "danger";
    } else if (c.priority === "Medium") {
      priorityColor = "warning";
    }

    card.innerHTML = `
            <div class="card-body">
                <h6 class="fw-bold">${c.customerName}</h6>

                <p class="mb-1">
                    <strong>Category:</strong> ${c.category}
                </p>

                <p class="mb-1">
                    <strong>Phone:</strong> ${c.phone}
                </p>

                <p class="mb-1">
                    <strong>Email:</strong> ${c.email}
                </p>

                <p class="mb-2">
                    ${c.description}
                </p>

                <span class="badge bg-${priorityColor}">
                    ${c.priority}
                </span>

                <div class="text-muted mt-2">
                    ${c.date}
                </div>
            </div>
        `;

    column.appendChild(card);
  });

  updateCounts();
}

function updateCounts() {
  const newCount = complaints.filter((c) => c.status === "New").length;
  const progressCount = complaints.filter(
    (c) => c.status === "In Progress",
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved",
  ).length;
  const closedCount = complaints.filter((c) => c.status === "Closed").length;

  const badges = document.querySelectorAll(".badge");

  badges[0].textContent = newCount;
  badges[1].textContent = progressCount;
  badges[2].textContent = resolvedCount;
  badges[3].textContent = closedCount;
}

function searchComplaint(text) {
  text = text.toLowerCase();

  const cards = document.querySelectorAll(".complaint-card");

  cards.forEach((card) => {
    if (card.innerText.toLowerCase().includes(text)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
