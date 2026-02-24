const vendors = [
  { name: "Guild Shop", bags: 5, price: 3.50 },
  { name: "Union Brew", bags: 2, price: 4.00 }
];

const container = document.getElementById("vendors");

vendors.forEach(v => {
  const card = document.createElement("div");
  card.innerHTML = `
    <h3>${v.name}</h3>
    <p>Bags available: ${v.bags}</p>
    <p>£${v.price}</p>
    <button>Reserve</button>
  `;
  container.appendChild(card);
});