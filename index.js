let complaints = [];
let editIndex = -1;

function saveComplaint() {
  const complaint = {
    customer: customerName.value,
    phone: phone.value,
    email: email.value,
    category: category.value,
    description: description.value,
    priority: priority.value,
    status: status.value,
    date: date.value,
  };

  if (
    complaint.customer == "" ||
    complaint.phone == "" ||
    complaint.email == "" ||
    complaint.description == ""
  ) {
    alert("Please fill all fields");
    return;
  }

  if (editIndex == -1) {
    complaints.push(complaint);
  } else {
    complaints[editIndex] = complaint;
    editIndex = -1;
  }

  showComplaints();

  clearForm();

  bootstrap.Modal.getInstance(document.getElementById("complaintModal")).hide();
}

function showComplaints() {
  newList.innerHTML = "";
  progressList.innerHTML = "";
  resolvedList.innerHTML = "";
  closedList.innerHTML = "";

  complaints.forEach((c, index) => {
    const card = `
        <div class="card shadow-sm mb-3">

            <div class="card-body">

                <h5>${c.customer}</h5>

                <p><b>Phone:</b> ${c.phone}</p>

                <p><b>Email:</b> ${c.email}</p>

                <p><b>Category:</b> ${c.category}</p>

                <p>${c.description}</p>

                <span class="badge bg-primary">${c.priority}</span>

                <p class="mt-2">${c.date}</p>

                <button class="btn btn-warning btn-sm me-2"
                onclick="editComplaint(${index})">

                Edit

                </button>

                <button class="btn btn-danger btn-sm"
                onclick="deleteComplaint(${index})">

                Delete

                </button>

            </div>

        </div>
        `;

    if (c.status == "New") {
      newList.innerHTML += card;
    } else if (c.status == "In Progress") {
      progressList.innerHTML += card;
    } else if (c.status == "Resolved") {
      resolvedList.innerHTML += card;
    } else {
      closedList.innerHTML += card;
    }
  });
}

function editComplaint(index) {
  editIndex = index;

  const c = complaints[index];

  customerName.value = c.customer;
  phone.value = c.phone;
  email.value = c.email;
  category.value = c.category;
  description.value = c.description;
  priority.value = c.priority;
  status.value = c.status;
  date.value = c.date;

  const modal = new bootstrap.Modal(document.getElementById("complaintModal"));

  modal.show();
}

function deleteComplaint(index) {
  if (confirm("Delete this complaint?")) {
    complaints.splice(index, 1);

    showComplaints();
  }
}
function clearForm() {
  customerName.value = "";
  phone.value = "";
  email.value = "";
  category.selectedIndex = 0;
  description.value = "";
  priority.selectedIndex = 0;
  status.selectedIndex = 0;
  date.value = "";
}
