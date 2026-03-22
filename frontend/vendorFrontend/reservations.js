const upcoming = document.getElementById('upcoming');
const past = document.getElementById('past');

const bags = JSON.parse(localStorage.getItem('bags') || '[]');

bags.forEach(bag => {
  const card = document.createElement('div');
  card.className = 'bag-card';
  card.innerHTML = `
    <h3>${bag.name} — ${bag.category}</h3>
    <p>${bag.description || "No description"}</p>
    <p>Price: £${bag.price}</p>
    <p>Collection: ${bag.collection_time || "TBD"}</p>
    <span style="color: blue;">Reserved</span>
    <button class="bagButton">Mark as Collected</button>
  `;
  upcoming.appendChild(card);
});