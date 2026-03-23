
//local storage version for frontend testing
document.getElementById('addBagForm').addEventListener('submit', (e) => {
  e.preventDefault();


  const allergenCheckboxes = document.querySelectorAll('input[name="allergen"]:checked');
    const allergens = Array.from(allergenCheckboxes).map(cb => ({
    allergen_id: parseInt(cb.id.replace('allergen-', '')),
    may_contain: false
    }));
  const newBag = {
    name: "Guild Shop",
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    collection_time: document.getElementById("time").value,
    is_vegan: document.getElementById("is_vegan").checked,
    is_vegetarian: document.getElementById("is_vegetarian").checked,
    is_gluten_free: document.getElementById("is_gluten_free").checked,
    allergens: allergens
  };

  const saved = JSON.parse(localStorage.getItem('bags') || '[]');
  saved.push(newBag);
  localStorage.setItem('bags', JSON.stringify(saved));
  window.location.href = 'vDashboard.html';
});


//uncomment when backend ready
/*

  const res = await fetch('http://127.0.0.1:8000/create_bag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBag)
  });

  const data = await res.json();

  if (data.message === "Bag created successfully!") {
    window.location.href = 'vDashboard.html';
  } else {
    document.getElementById('error').textContent = 'Something went wrong, please try again.';
  }
  */