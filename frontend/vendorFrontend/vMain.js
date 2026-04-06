//JS for Dashboard
let bags = [];
let allBags = [];
const container = document.getElementById("bags");
let editIndex = null;

async function loadBags() {
  const vendor_id = localStorage.getItem('vendor_id');
  const res = await fetch(`http://127.0.0.1:8000/bags`);
  const data = await res.json();
  let allBags = data;
  bags = allBags.filter(b => b.vendor_id === parseInt(vendor_id));
  bags.forEach((bag, index) => addBagCard(bag, index));
}

loadBags();
document.getElementById("welcome").innerHTML= ` <p> Welcome Back, ${localStorage.getItem('vendor_name')} </p>`;

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
            cardToDelete = card;
            bagIdToDelete = bag.bag_id;
            document.getElementById('delete-message').innerHTML = `Are you sure you want to delete "${bag.product_name}"?`;
            document.getElementById('deleteModal').style.display = 'block';
        });
    }
  container.appendChild(card);
}


//modal view shows when delete button on card is clicked - opens and asks if they confirm delete
const deleteModal = document.getElementById('deleteModal');
let cardToDelete = null;
let bagIdToDelete = null;
document.getElementById('confirm-delete').addEventListener('click', async () => {
  const res = await fetch(`http://127.0.0.1:8000/vendor/bags/${bagIdToDelete}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (data.message === 'Bag deleted successfully') {
    cardToDelete.remove();
    document.getElementById('deleteModal').style.display = 'none';
    showNotification('Bag deleted successfully');
  } else {
    showNotification('Something went wrong', 'error');
  }
});

document.getElementById('deleteClose').onclick = () => document.getElementById('deleteModal').style.display = 'none';



//edit modal  when edit button on card is clicked - shows current values of that bag and lets you save
const editModal = document.getElementById('editModal');
document.getElementById('editClose').onclick = () => editModal.style.display = 'none';

document.getElementById('edit-save').addEventListener('click', async () => {
    let current_bag = bags[editIndex];
    const res = await fetch(`http://127.0.0.1:8000/vendor/bags/${current_bag.bag_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        product_name: document.getElementById('edit-product_name').value,
        description: document.getElementById('edit-description').value,
        category: document.getElementById('edit-category').value,
        discounted_price: parseFloat(document.getElementById('edit-price').value),
        pickup_window_start: document.getElementById('edit-pickup_window_start').value,
        pickup_window_end: document.getElementById('edit-pickup_window_end').value,
        quantity: parseInt(document.getElementById('edit-quantity').value)
        })
    });

    const data = await res.json();

    if (data.message === 'Bag updated successfully') {
        editModal.style.display = 'none';
        setTimeout(() => location.reload(), 1500);
        showNotification('Bag updated successfully');
    } else {
        showNotification('Something went wrong', 'error');
    }
});

//to close modals if window clicked
window.onclick = (e) => {
  if (e.target == editModal) editModal.style.display = 'none';
};
window.onclick = (e) => {
  if (e.target == deleteModal) deleteModal.style.display = 'none';
};

//notification shows when edit/delete happens - customised per action
function showNotification(message, type = 'success') {
  const notif = document.getElementById('notification');
  notif.textContent = message;
  notif.className = type;
  notif.style.display = 'block';
  setTimeout(() => notif.style.display = 'none', 10000);
}

