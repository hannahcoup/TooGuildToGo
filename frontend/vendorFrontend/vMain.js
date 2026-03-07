const bags = [
  { name: "Guild Shop", category:"Pastries" },
  { name: "Guild Shop", category:"Sandwiches" },
  { name: "Guild Shop", bags: 2, category:"Sweet Treat" }
];

const container = document.getElementById("bags");

bags.forEach(b => {
  const card = document.createElement("div");
  card.className = "bag-card"
  card.innerHTML = `
    <h3>${b.name}</h3>
    <button class="bagButton">Mark as Recieved </button>
    <button class="bagButton"><img src="../images/binICON.png" width=30 height =30> </button>
    <p> Category: ${b.category} </p>
  `;
  container.appendChild(card);
});