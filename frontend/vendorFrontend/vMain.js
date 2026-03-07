//need some way of having name set for session?
if (!localStorage.getItem('bags')) {
  const defaultBags = [
    { name: "Guild Shop", category: "Pastries" },
    { name: "Guild Shop", category: "Sandwiches" },
    { name: "Guild Shop", category: "Sweet Treat" }
  ];
  localStorage.setItem('bags', JSON.stringify(defaultBags));
}
const container = document.getElementById("bags");
const bags = JSON.parse(localStorage.getItem('bags') || '[]');

bags.forEach(b => addBagCard(b));



function addBagCard(bag) {
  const card = document.createElement("div");
  card.className = "bag-card";
  card.innerHTML = `
    <h3>${bag.name}</h3>
    <button class="bagButton">Mark as Received</button>
    <button class="bagButton"><img src="../images/binICON.png" width=30 height=30></button>
    <p>Category: ${bag.category}</p>
    <p>Price: £${bag.price}</p>
  `;
  container.appendChild(card);
}


