

//Loading bags from db
let bags = [];
const container = document.getElementById("food-items-info");
async function loadBags() {
  const res = await fetch(`http://127.0.0.1:8000/bags`);
  const data = await res.json();
  let bags = data;
  bags.forEach((bag, index) => addBagCard(bag, index));
}
loadBags();

let editIndex = null;

function addBagCard(bag, index) {
  const card = document.createElement("div");
  card.className = "bag-card";
  card.innerHTML = `
    <h3>${bag.product_name}</h3>
    <p>Category: ${bag.category}</p>
    <p>Discounted Price: £${bag.discounted_price}</p>
    <p>Quantity remaining: ${bag.quantity <= 0 ? '<span style="color:red;">Sold Out</span>' : `<span style="color:green;">${bag.quantity} </span>`}</p>
    <p>Expiry Date: ${new Date(bag.expires_at) < new Date() ? '<span style="color:red;">Expired</span>' : `<span style="color:green;">${bag.expires_at} </span>`}</p>
    ${bag.status !== 'collected' ? '<button class="bagButton deleteButton" ><img src="../images/binICON.png" width=20 height=20></button>'  : ''}
    
    ${bag.status !== 'collected' ? '<button class="bagButton editBtn">Edit</button>' : ''}
    
  `;
  container.appendChild(card);
}

