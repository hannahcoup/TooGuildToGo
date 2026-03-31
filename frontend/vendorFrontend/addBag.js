
//local storage version for frontend testing
document.getElementById('addBagForm').addEventListener('submit', (e) => {
  e.preventDefault();


  const allergenCheckboxes = document.querySelectorAll('input[name="allergen"]:checked');
    const allergens = Array.from(allergenCheckboxes).map(cb => ({
    allergen_id: parseInt(cb.id.replace('allergen-', '')),
    may_contain: false
    }));

const dietaryIds = [];
if (document.getElementById("is_vegan").checked) dietaryIds.push(1);
if (document.getElementById("is_vegetarian").checked) dietaryIds.push(2);
if (document.getElementById("is_gluten_free").checked) dietaryIds.push(3);
if (document.getElementById("contains_meat").checked) dietaryIds.push(4);
if (document.getElementById("contains_dairy").checked) dietaryIds.push(5);
if (document.getElementById("is_spicy").checked) dietaryIds.push(6);

  const newBag = {
    vendor_id: localStorage.getItem('vendor_id') || 1, // 1 for now since im testing
    name: "Guild Shop",
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    collection_time: document.getElementById("time").value,
    quantity: document.getElementById("quantity").value,
    dietary_tag_ids: dietaryIds,
    allergens: allergens,
    status: 'available'
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