document.getElementById('addBagForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const newBag = {
    name: "Guild Shop",
    category: document.getElementById("category").value,
    price: document.getElementById("price").value
  };

  const saved = JSON.parse(localStorage.getItem('bags') || '[]');
  saved.push(newBag);
  localStorage.setItem('bags', JSON.stringify(saved));
  window.location.href = 'vDashboard.html';
});