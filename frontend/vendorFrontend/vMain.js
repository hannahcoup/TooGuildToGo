//JS for Dashboard
let bags = [];
const container = document.getElementById("bags");
let editIndex = null;
let cardToDelete = null;
let bagIdToDelete = null;
 
async function loadBags() {
  const vendor_id = localStorage.getItem('vendor_id');
  const res = await fetch(`https://tooguildtogo.onrender.com/bags?vendor_id=${vendor_id}`);
  const data = await res.json();
 
  container.innerHTML = "";
  bags = data.filter(b => b.vendor_id === parseInt(vendor_id));
  bags.forEach((bag, index) => addBagCard(bag, index));
}
 
loadBags();
 
document.getElementById("welcome").innerHTML =
  `<p><b>Welcome Back, ${localStorage.getItem('vendor_name')}</b></p>`;
 
async function addBagCard(bag, index) {
  const card = document.createElement("div");
 
  // Try fetching allergens; silently fall back to "Unavailable" on any error (incl. CORS)
  let allergensText = "Unavailable";
  try {
    const allergenbag = await fetch(`https://tooguildtogo.onrender.com/bags/${bag.bag_id}/allergens`);
    if (allergenbag.ok) {
      const allergens = await allergenbag.json();
      if (Array.isArray(allergens) && allergens.length > 0) {
        allergensText = allergens
          .map(a => a.may_contain ? `${a.allergen_name} (may contain)` : `${a.allergen_name}`)
          .join(", ");
      } else {
        allergensText = "None";
      }
    }
  } catch (e) {
    // CORS or network error — just show Unavailable, don't log noise
  }
 
  const expiryDate = new Date(bag.expires_at);
  const isExpired = expiryDate < new Date();
 
  card.className = "bag-card";
  card.innerHTML = `
    <h3>${bag.product_name}</h3>
    <p>Category: ${bag.category}</p>
    <p>Discounted Price: £${bag.discounted_price}</p>
    <p>Quantity remaining: ${
      bag.quantity <= 0
        ? '<span style="color:red;">Sold Out</span>'
        : `<span style="color:green;">${bag.quantity}</span>`
    }</p>
    <p>Expiry Date: ${
      isExpired
        ? '<span style="color:red;">Expired</span>'
        : `<span style="color:green;">${formatDateTime(bag.expires_at)}</span>`
    }</p>
    <p>Allergens: ${allergensText}</p>
    ${bag.status !== 'collected' ? '<button class="bagButton deleteButton"><img src="../images/binICON.png" width="20" height="20"></button>' : ''}
    ${bag.status !== 'collected' ? '<button class="bagButton editBtn">Edit</button>' : ''}
  `;
 
  const editBtn = card.querySelector('.editBtn');
  if (editBtn) {
    editBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      editIndex = index;
 
      const vendor_id = localStorage.getItem('vendor_id');
      const foodRes = await fetch(`https://tooguildtogo.onrender.com/vendor/food_items?vendor_id=${vendor_id}`);
      const foodItems = await foodRes.json();
 
      const bagFoodRes = await fetch(`https://tooguildtogo.onrender.com/bags/${bag.bag_id}/food_items`);
      const currentFoodIds = await bagFoodRes.json();
      const currentIds = currentFoodIds.map(f => f.food_id);
 
      document.getElementById('edit-product_name').value = bag.product_name || '';
      document.getElementById('edit-description').value = bag.description || '';
      document.getElementById('edit-category').value = bag.category || '';
      document.getElementById('edit-price').value = bag.discounted_price || '';
      document.getElementById('edit-pickup_window_start').value = bag.pickup_window_start || '';
      document.getElementById('edit-pickup_window_end').value = bag.pickup_window_end || '';
      document.getElementById('edit-quantity').value = bag.quantity || '';
 
      const grouped = {};
      foodItems.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });
 
      const foodContainer = document.getElementById('foodItemsContainer');
      foodContainer.innerHTML = '';
 
      Object.entries(grouped).forEach(([category, items]) => {
        const legend = document.createElement('p');
        legend.innerHTML = `<b>${category}</b>`;
        foodContainer.appendChild(legend);
 
        items.forEach(item => {
          const label = document.createElement('label');
          const checked = currentIds.includes(item.food_id) ? 'checked' : '';
          label.innerHTML = `<input type="checkbox" id="food-${item.food_id}" name="food_item" value="${item.food_id}" ${checked}> ${item.name}`;
          foodContainer.appendChild(label);
        });
      });
 
      const dietaryRes = await fetch(`https://tooguildtogo.onrender.com/bags/${bag.bag_id}/dietary_tags`);
      const dietaryTags = await dietaryRes.json();
      const currentDietaryNames = dietaryTags.map(d => d.name);
 
      const allDietaryTags = [
        { id: 1, name: 'Vegan' },
        { id: 2, name: 'Vegetarian' },
        { id: 3, name: 'Gluten-Free' },
        { id: 4, name: 'Contains Meat' },
        { id: 5, name: 'Contains Dairy' },
        { id: 6, name: 'Spicy' },
        { id: 7, name: 'Halal' }
      ];
 
      const dietaryContainer = document.getElementById('edit-dietary-container');
      dietaryContainer.innerHTML = '';
      allDietaryTags.forEach(tag => {
        const checked = currentDietaryNames.includes(tag.name) ? 'checked' : '';
        const label = document.createElement('label');
        label.style.cssText = 'display:flex; align-items:center; gap:4px; font-size:13px;';
        label.innerHTML = `<input type="checkbox" id="dietary-${tag.id}" name="dietary_tag" value="${tag.id}" ${checked}> ${tag.name}`;
        dietaryContainer.appendChild(label);
      });
 
      document.getElementById('editModal').style.display = 'block';
    });
  }
 
  const deleteButton = card.querySelector('.deleteButton');
  if (deleteButton) {
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      cardToDelete = card;
      bagIdToDelete = bag.bag_id;
      document.getElementById('delete-message').innerHTML = `Are you sure you want to delete "${bag.product_name}"?`;
      document.getElementById('deleteModal').style.display = 'block';
    });
  }
 
  container.appendChild(card);
}
 
const deleteModal = document.getElementById('deleteModal');
const editModal = document.getElementById('editModal');
 
document.getElementById('confirm-delete').addEventListener('click', async () => {
  const res = await fetch(`https://tooguildtogo.onrender.com/vendor/bags/${bagIdToDelete}`, {
    method: 'DELETE'
  });
  const data = await res.json();
 
  if (data.message === 'Bag deleted successfully') {
    cardToDelete.remove();
    deleteModal.style.display = 'none';
    showNotification('Bag deleted successfully');
  } else {
    showNotification('Something went wrong', 'error');
  }
});
 
document.getElementById('deleteClose').onclick = () => deleteModal.style.display = 'none';
document.getElementById('editClose').onclick = () => editModal.style.display = 'none';
 
document.getElementById('edit-save').addEventListener('click', async () => {
  const foodCheckboxes = document.querySelectorAll('input[name="food_item"]:checked');
  const food_ids = Array.from(foodCheckboxes).map(cb => parseInt(cb.value));
 
  const current_bag = bags[editIndex];
 
  const res = await fetch(`https://tooguildtogo.onrender.com/vendor/bags/${current_bag.bag_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_name: document.getElementById('edit-product_name').value,
      description: document.getElementById('edit-description').value,
      category: document.getElementById('edit-category').value,
      food_ids: food_ids,
      discounted_price: parseFloat(document.getElementById('edit-price').value),
      pickup_window_start: document.getElementById('edit-pickup_window_start').value || null,
      pickup_window_end: document.getElementById('edit-pickup_window_end').value || null,
      quantity: parseInt(document.getElementById('edit-quantity').value)
    })
  });
 
  const data = await res.json();
 
  if (data.message === 'Bag updated successfully') {
    editModal.style.display = 'none';
    showNotification('Bag updated successfully');
    setTimeout(() => location.reload(), 1200);
  } else {
    showNotification('Something went wrong', 'error');
  }
});
 
window.onclick = (e) => {
  if (e.target === editModal) editModal.style.display = 'none';
  if (e.target === deleteModal) deleteModal.style.display = 'none';
};
 
function showNotification(message, type = 'success') {
  const notif = document.getElementById('notification');
  notif.textContent = message;
  notif.className = type;
  notif.style.display = 'block';
  setTimeout(() => notif.style.display = 'none', 10000);
}
 
function formatDateTime(datetime) {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
