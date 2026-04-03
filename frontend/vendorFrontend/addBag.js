async function loadFoodItems() {
  const vendor_id = localStorage.getItem('vendor_id') || 1;
  
  /*const res = await fetch(`http://127.0.0.1:8000/vendor_food_items?vendor_id=${vendor_id}`);
  const foodItems = await res.json();*/

  const foodItems = [
    { food_id: 1, name: "Baked Beans", category: "Hot Filling" },
    { food_id: 2, name: "BBQ Sloppy Joe", category: "Hot Filling" },
    { food_id: 3, name: "Garlic and Chilli Chicken", category: "Hot Filling" },
    { food_id: 4, name: "Butters", category: "Hot Filling" },
    { food_id: 5, name: "Seasoned", category: "Hot Filling" },
    { food_id: 6, name: "Garlic Vegan", category: "Hot Filling" },
    { food_id: 7, name: "Firecracker", category: "Hot Filling" },
    { food_id: 8, name: "Tuna Mayo", category: "Cold Filling" },
    { food_id: 9, name: "Grated Cheese", category: "Cold Filling" },
    { food_id: 10, name: "Chicken Mayo", category: "Cold Filling" },
    { food_id: 11, name: "Coleslaw", category: "Cold Filling" },
    { food_id: 12, name: "Chef's Choice", category: "Cold Filling" }
  ];

  const grouped = {};
  foodItems.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  const container = document.getElementById('foodItemsContainer');
  container.innerHTML = '';
  
  Object.entries(grouped).forEach(([category, items]) => {
    const legend = document.createElement('p');
    legend.innerHTML = `<b>${category}</b>`;
    container.appendChild(legend);
    items.forEach(item => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" id="food-${item.food_id}" name="food_item" value="${item.food_id}"> ${item.name}`;
      container.appendChild(label);
    });
  });
}

loadFoodItems();

document.getElementById('addBagForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const foodCheckboxes = document.querySelectorAll('input[name="food_item"]:checked');
  const food_ids = Array.from(foodCheckboxes).map(cb => parseInt(cb.value));

  /*const dietaryIds = [];
  if (document.getElementById("is_vegan").checked) dietaryIds.push(1);
  if (document.getElementById("is_vegetarian").checked) dietaryIds.push(2);
  if (document.getElementById("is_gluten_free").checked) dietaryIds.push(3);
  if (document.getElementById("contains_meat").checked) dietaryIds.push(4);
  if (document.getElementById("contains_dairy").checked) dietaryIds.push(5);
  if (document.getElementById("is_spicy").checked) dietaryIds.push(6);*/

  const newBag = {
    vendor_id: parseInt(localStorage.getItem('vendor_id')) || 1,
    product_name: document.getElementById("product_name").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    original_price: parseFloat(document.getElementById("original_price").value),
    discounted_price: parseFloat(document.getElementById("discounted_price").value),
    pickup_window_start: document.getElementById("pickup_window_start").value,
    pickup_window_end: document.getElementById("pickup_window_end").value,
    expires_at: document.getElementById("expires_at").value,
    quantity: parseInt(document.getElementById("quantity").value),
    food_ids: food_ids,
    status: 'available'
  };

  const res = await fetch('http://127.0.0.1:8000/vendor/add-bag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBag)
  });

  const data = await res.json();

  if (data.message === "bag created successfully") {
    window.location.href = 'vDashboard.html';
  } else {
    document.getElementById('error').textContent = data.error || 'Something went wrong, please try again.';
  }
});
  /**
   * bag schema:
   * CREATE TABLE bags (
    id                  SERIAL PRIMARY KEY,
    vendor_id           INT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    product_name        VARCHAR(120) NOT NULL,
    description         TEXT,
    category            VARCHAR(80) NOT NULL,
    original_price      DECIMAL(6,2) NOT NULL CHECK (original_price > 0),
    discounted_price    DECIMAL(6,2) NOT NULL CHECK (discounted_price > 0),
    quantity            INT NOT NULL CHECK (quantity >= 0),
    pickup_window_start TIMESTAMP NOT NULL,
    pickup_window_end   TIMESTAMP NOT NULL,
    expires_at          TIMESTAMP NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'available',
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('available', 'reserved', 'collected')),
    CHECK (discounted_price <= original_price),
    CHECK (pickup_window_end > pickup_window_start),
    CHECK (expires_at <= pickup_window_end)
);
   */