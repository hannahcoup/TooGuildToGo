
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
    //need to create bag id somehow
    vendor_id: localStorage.getItem('vendor_id') || 1, // 1 for now since im testing
    product_name: "Guild Shop",
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    original_price: document.getElementById("original_price").value,
    discounted_price: document.getElementById("discounted_price").value,
    pickup_window_start: document.getElementById("pickup_window_start").value,
    pickup_window_end: document.getElementById("pickup_window_end").value,
    expires_at: document.getElementById("expires_at").value,
    quantity: document.getElementById("quantity").value,
    dietary_tag_ids: dietaryIds,//wont need
    allergens: allergens,
    status: 'available',
    created_at: Date.now()
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