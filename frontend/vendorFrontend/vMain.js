//JS for Dashboard

const container = document.getElementById("bags");
const bags = JSON.parse(localStorage.getItem('bags') || '[]');
let editIndex = null;
bags.forEach((bag, index) => addBagCard(bag, index));



function addBagCard(bag, index) {
  const card = document.createElement("div");
  card.className = "bag-card";
  card.innerHTML = `
    <h3>${bag.name}</h3>
    ${bag.status !== 'collected' ? '<button class="bagButton deleteButton" ><img src="../images/binICON.png" width=20 height=20></button>'  : ''}
    <p>Category: ${bag.category}</p>
    <p>Price: £${bag.price}</p>
    <p>Quantity remaining: ${bag.quantity <= 0 ? '<span style="color:red;">Sold Out</span>' : `<span style="color:green;">${bag.quantity} remaining</span>`}</p>
    ${bag.status !== 'collected' ? '<button class="bagButton editBtn">Edit</button>' : ''}
  `;

  const editBtn = card.querySelector('.editBtn');
    if (editBtn) {
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editIndex = index;

        // fills the form with current values
        document.getElementById('edit-description').value = bag.description || '';
        document.getElementById('edit-category').value = bag.category || '';
        document.getElementById('edit-price').value = bag.price || '';
        document.getElementById('edit-time').value = bag.collection_time || '';
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


