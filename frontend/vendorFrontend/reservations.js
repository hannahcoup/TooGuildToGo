const upcoming = document.getElementById('upcoming');
const past = document.getElementById('past');

const allergenNames = {
  1: 'Celery', 2: 'Gluten', 3: 'Crustaceans', 4: 'Eggs',
  5: 'Fish', 6: 'Lupin', 7: 'Milk', 8: 'Molluscs',
  9: 'Mustard', 10: 'Nuts', 11: 'Peanuts', 12: 'Sesame',
  13: 'Soya', 14: 'Sulphites'
};

// TODO: replace with GET /reservations?vendor_id=X when backend ready
const bags = JSON.parse(localStorage.getItem('bags') || '[]');
let selectedIndex = null;
/**
 * Each bag consists of: name, category, description, price, collection time, and a status 
 * for each bag - stored in local storage for now - a card is created and appended to the upcoming
 *  or past section depending on their status. 
 * clicking on a bag opens a modal view which provides more detail on a bag such as a longer description and allergens
 * +to do - get upcoming bags sorted by time - need to have CUSTOMER name aswell???
 */
bags.sort((a, b) => a.collection_time.localeCompare(b.collection_time));
//sorts bags by time of collection
bags.forEach((bag, index) => {
  const card = document.createElement('div');
  const shortDesc = bag.description && bag.description.length > 20 ? bag.description.substring(0, 20) + '...' : bag.description
  card.className = 'bag-card';
  card.innerHTML = `
    <h3>${bag.name} — ${bag.category}</h3>
    <p>${shortDesc || "No Description"}</p>
    <p>Price: £${bag.price}</p>
    <p>Collection: ${bag.collection_time || "TBD"}</p>
    <span style="color: blue;">Reserved</span>
    ${bag.status !== 'collected' ? '<button class="bagButton">Mark as Collected</button>' : ''}
  `;
    if (bag.status === 'collected') {
    past.appendChild(card);  // already collected goes to past
  } else {
    upcoming.appendChild(card);  // everything else goes to upcoming
  }


  
  card.addEventListener('click', () => {
    selectedIndex = index;
    const modal = document.getElementById('myModal');
    document.getElementById('modal-name').textContent = bag.name;
    document.getElementById('modal-desc').textContent = bag.description || "No Description";
    document.getElementById('modal-price').textContent = 'Price : £' + bag.price;
    document.getElementById('modal-time').textContent = "Time : " + bag.collection_time;

    document.getElementById('modal-allergens').textContent = bag.allergens && bag.allergens.length > 0 ? bag.allergens.map(a => allergenNames[a.allergen_id]).join(', ') : 'None';

    const dietary = [];//array to store dietary values since theyre stored as bools 
    if (bag.is_vegan) dietary.push('Vegan');
    if (bag.is_vegetarian) dietary.push('Vegetarian');
    if (bag.is_gluten_free) dietary.push('Gluten-Free');

    document.getElementById('modal-dietary').textContent = dietary.length > 0 ? dietary.join(', ') : 'None';
    modal.style.display = 'block';
    });

const collectBtn = card.querySelector('.bagButton');
if(collectBtn){
    collectBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // to stop modal view opening
    
    bags[index].status = 'collected';
    localStorage.setItem('bags', JSON.stringify(bags));
    
    past.appendChild(card); // moves card to past panel
    });
}
});

const span = document.getElementsByClassName('close')[0];
const modal = document.getElementById('myModal');

span.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; }

document.getElementById('modal-collect').addEventListener('click', () => {
  bags[selectedIndex].status = 'collected';
  localStorage.setItem('bags', JSON.stringify(bags));
  
  modal.style.display = 'none';
  location.reload(); //  re-render the cards
});