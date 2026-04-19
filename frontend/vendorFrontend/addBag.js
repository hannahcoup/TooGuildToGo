const API = "https://tooguildtogo.onrender.com";

async function loadFoodItems() {
  const vendor_id = parseInt(localStorage.getItem('vendor_id') || '1', 10);
  const container = document.getElementById('foodItemsContainer');
  container.innerHTML = 'Loading food items...';

  try {
    const res = await fetch(`${API}/vendor/food_items?vendor_id=${vendor_id}`);

    if (!res.ok) {
      throw new Error(`food items request failed: ${res.status}`);
    }

    const foodItems = await res.json();
    console.log("food items:", foodItems);

    if (!Array.isArray(foodItems) || foodItems.length === 0) {
      container.innerHTML = '<p>No food items available.</p>';
      return;
    }

    const grouped = {};
    foodItems.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    container.innerHTML = '';

    Object.entries(grouped).forEach(([category, items]) => {
      const legend = document.createElement('p');
      legend.innerHTML = `<b>${category}</b>`;
      container.appendChild(legend);

      items.forEach(item => {
        const label = document.createElement('label');
        label.innerHTML = `
          <input type="checkbox" id="food-${item.food_id}" name="food_item" value="${item.food_id}">
          ${item.name}
        `;
        container.appendChild(label);
      });
    });

  } catch (err) {
    console.error("Could not load food items:", err);
    container.innerHTML = '<p>Could not load food items.</p>';
  }
}

loadFoodItems();

document.getElementById('addBagForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = e.submitter || document.querySelector('#addBagForm button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';
  }

  document.getElementById('error').textContent = '';

  try {
    const vendor_id = parseInt(localStorage.getItem('vendor_id') || '1', 10);

    const foodCheckboxes = document.querySelectorAll('input[name="food_item"]:checked');
    const food_ids = Array.from(foodCheckboxes).map(cb => parseInt(cb.value));
    if (food_ids.length === 0) {
      document.getElementById('error').textContent = 'Select at least one food item';
      return;
    }

    const dietaryCheckboxes = document.querySelectorAll('input[name="dietary_tag"]:checked');
    const dietary_tag_ids = Array.from(dietaryCheckboxes).map(cb => parseInt(cb.value));

    const pickup_start = document.getElementById("pickup_window_start").value;
    const pickup_end = document.getElementById("pickup_window_end").value;
    const expires = document.getElementById("expires_at").value;

    if (pickup_end <= pickup_start) {
      document.getElementById('error').textContent =
        'Pickup window end must be after pickup window start';
      return;
    }

    if (expires < pickup_start) {
      document.getElementById('error').textContent =
        'Expiry must be after or equal to pickup window start';
      return;
    }

    if (expires > pickup_end) {
      document.getElementById('error').textContent =
        'Expiry must be before or equal to pickup window end';
      return;
    }
    if (food_ids.length === 0) {
      document.getElementById('error').textContent = 'Select at least one food item';
      return;
    }

    const payload = {
      vendor_id: vendor_id,
      product_name: document.getElementById('product_name').value,
      description: document.getElementById('description').value,
      category: document.getElementById('category').value,
      original_price: parseFloat(document.getElementById('original_price').value),
      discounted_price: parseFloat(document.getElementById('discounted_price').value),
      quantity: parseInt(document.getElementById('quantity').value),
      pickup_window_start: pickup_start,
      pickup_window_end: pickup_end,
      expires_at: expires,
      food_ids: food_ids,
      dietary_tag_ids: dietary_tag_ids
    };

    console.log("Submitting bag:", payload);

    const res = await fetch(`${API}/vendor/add-bag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Add bag response:", data);

    if (res.ok && data.message === 'bag created successfully') {
      alert('Bag added successfully');
      window.location.href = 'vDashboard.html';
    } else {
      document.getElementById('error').textContent =
        data.error || JSON.stringify(data.detail) || 'Something went wrong';
    }

  } catch (err) {
    console.error("Add bag failed:", err);
    document.getElementById('error').textContent = 'Could not add bag';
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add';
    }
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
