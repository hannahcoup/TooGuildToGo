async function loadFoodItems() {
  const vendor_id = localStorage.getItem('vendor_id') || 1;
  
  const res = await fetch(`https://tooguildtogo.onrender.com/vendor/food_items?vendor_id=${vendor_id}`);
  const foodItems = await res.json();

 

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
const pickup_end = new Date(document.getElementById("pickup_window_end").value);
const expires = new Date(document.getElementById("expires_at").value);

if (expires <= pickup_end) {
  document.getElementById('error').textContent = 'Expiry must be before or equal to pickup window end';
  return;
}
  const dietaryIds = [];
  if (document.getElementById("is_vegan").checked) dietaryIds.push(1);
  if (document.getElementById("is_vegetarian").checked) dietaryIds.push(2);
  if (document.getElementById("is_gluten_free").checked) dietaryIds.push(3);
  if (document.getElementById("contains_meat").checked) dietaryIds.push(4);
  if (document.getElementById("contains_dairy").checked) dietaryIds.push(5);
  if (document.getElementById("is_spicy").checked) dietaryIds.push(6);

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
    dietary_tag_ids: dietaryIds,
    food_ids: food_ids,
    status: 'available'
  };

  const res = await fetch('https://tooguildtogo.onrender.com/vendor/add-bag', {
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
