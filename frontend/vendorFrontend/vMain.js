//JS for Dashboard

const container = document.getElementById("bags");
/** 
const bags = JSON.parse(localStorage.getItem('bags') || '[]');

bags.forEach((bag, index) => addBagCard(bag, index));
*/

async function loadBags() {
  const vendor_id = localStorage.getItem('vendor_id');
  
  const res = await fetch(`http://127.0.0.1:8000/bags`);
  const data = await res.json();
  bags = data;
  bags.forEach((bag, index) => addBagCard(bag, index));
}

loadBags();
document.getElementById("welcome").innerHTML= ` <p> WELCOME BACK, ${localStorage.getItem('vendor_name')} </p>`;
let editIndex = null;
// TODO: replace with GET /bags?vendor_id=${localStorage.getItem('vendor_id')}

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

  const editBtn = card.querySelector('.editBtn');
    if (editBtn) {
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editIndex = index;

        // fills the form with current values
        document.getElementById('edit-product_name').value = bag.product_name || '';
        document.getElementById('edit-description').value = bag.description || '';
        document.getElementById('edit-category').value = bag.category || '';
        document.getElementById('edit-price').value = bag.discounted_price || '';
        document.getElementById('edit-pickup_window_start').value = bag.pickup_window_start || '';
        document.getElementById('edit-pickup_window_end').value = bag.pickup_window_end || '';
        document.getElementById('edit-quantity').value = bag.quantity || '';

        document.getElementById('editModal').style.display = 'block';
    });
    }

    const deleteButton = card.querySelector('.deleteButton');
    if (deleteButton) {
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        //replace following lines when backend ready - also make async
        bags.splice(index, 1); //this removes 1 item at the index
        localStorage.setItem('bags', JSON.stringify(bags)); // saves updated array
        card.remove();
        /*with this:
        const data = await res.json();
        if (data.message === 'Bag deleted successfully') {
        card.remove();
        }*/
    });
}
  container.appendChild(card);
}





const editModal = document.getElementById('editModal');

document.getElementById('editClose').onclick = () => editModal.style.display = 'none';

document.getElementById('edit-save').addEventListener('click', () => {
  bags[editIndex].description = document.getElementById('edit-description').value;
  bags[editIndex].category = document.getElementById('edit-category').value;
  bags[editIndex].price = document.getElementById('edit-price').value;
  bags[editIndex].collection_time = document.getElementById('edit-time').value;
  bags[editIndex].quantity = document.getElementById('edit-quantity').value;

  localStorage.setItem('bags', JSON.stringify(bags));
  editModal.style.display = 'none';
  location.reload();
});

window.onclick = (e) => {
  if (e.target == editModal) editModal.style.display = 'none';
};


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