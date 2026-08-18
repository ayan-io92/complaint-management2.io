let allUsers = [];

async function getUsers() {
  const response = await fetch("https://dummyjson.com/users");

  const data = await response.json();

  allUsers = data.users;

  allUsers.forEach((user) => {
    generateCard(user);
  });
}

function generateCard(user) {
  const container = document.getElementById("users-container");

  const card = document.createElement("div");

  card.classList.add("user-card");

  card.innerHTML = `
        <img src="${user.image}" alt="${user.firstName}" class="user-image">

        <h3>${user.firstName} ${user.lastName}</h3>

        <p>Email: ${user.email}</p>
        <p>Phone: ${user.phone}</p>
        <p>Age: ${user.age}</p>
        <p>Gender: ${user.gender}</p>
    `;

  container.appendChild(card);
}

getUsers();
