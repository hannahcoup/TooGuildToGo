//async function loadReservations() {
    const upcoming = document.getElementById('upcoming');
    const past = document.getElementById('past');

    const allergenNames = {
    1: 'Celery', 2: 'Gluten', 3: 'Crustaceans', 4: 'Eggs',
    5: 'Fish', 6: 'Lupin', 7: 'Milk', 8: 'Molluscs',
    9: 'Mustard', 10: 'Nuts', 11: 'Peanuts', 12: 'Sesame',
    13: 'Soya', 14: 'Sulphites'
    };

    // TODO: replace with GET /reservations?vendor_id=X when backend ready
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const bags = JSON.parse(localStorage.getItem('bags') || '[]');
    let selectedIndex = null;

    /**
     * Each bag consists of: name, category, description, price, collection time, and a status 
     * for each bag - stored in local storage for now - a card is created and appended to the upcoming
     *  or past section depending on their status. 
     * clicking on a bag opens a modal view which provides more detail on a bag such as a longer description and allergens
     * +to do - get upcoming bags sorted by time - need to have CUSTOMER name aswell???
     */
    reservations.sort((a, b) => a.collection_time.localeCompare(b.collection_time));
    //sorts bags by time of collection
    reservations.forEach((reservation, index) => {
        const bag = bags[reservation.bag_id];
        if (!bag) return;
    const card = document.createElement('div');
    
    // BACKEND: will be reservation.bag_description
    const shortDesc = bag.description && bag.description.length > 20 ? bag.description.substring(0, 20) + '...' : bag.description
    card.className = 'bag-card';
    card.innerHTML = `
        <h3>${reservation.user_id}</h3> 
        <p>${shortDesc || "No Description"}</p>
        <p>Price: £${bag.discounted_price}</p>
        <p>Collection Window: ${reservation.pickup_window_start || "TBD"} - ${reservation.pickup_window_end || "TBD"}</p>
        <span style="font-style:italic">Reserved </span>
        ${reservation.status !== 'collected' ? '<button class="bagButton">Mark as Collected</button>' : ''}

        ${reservation.status !== 'collected' ? "Payment Status: ":" "}  
        ${reservation.status !== 'collected' ?  reservation.payment_status : ''} 
        
        
    `;
        if (reservation.status === 'collected') {
        past.appendChild(card);  // already collected goes to past
    } else {
        upcoming.appendChild(card);  // everything else goes to upcoming
    }


    
    card.addEventListener('click', () => {
        selectedIndex = index;
        const modal = document.getElementById('myModal');
        document.getElementById('modal-name').textContent = reservation.product_name;
        document.getElementById('modal-desc').textContent = bag.description || "No Description";
        document.getElementById('modal-price').textContent = 'Price : £' + bag.discounted_price;
        document.getElementById('modal-time').textContent = "Pickup Window : " + reservation.pickup_window_start +"-"+ reservation.pickup_window_end;

        document.getElementById('modal-allergens').textContent = bag.allergens && bag.allergens.length > 0 ? bag.allergens.map(a => allergenNames[a.allergen_id]).join(', ') : 'None';

        const dietary = [];//array to store dietary values since theyre stored as bools 
        if (bag.is_vegan) dietary.push('Vegan');
        if (bag.is_vegetarian) dietary.push('Vegetarian');
        if (bag.is_gluten_free) dietary.push('Gluten-Free');

        document.getElementById('modal-dietary').textContent = dietary.length > 0 ? dietary.join(', ') : 'None';
        document.getElementById('modal-collect').style.display = reservation.status === 'collected' ? 'none' : 'block';
        document.getElementById('modal-payment_status').style.display = reservation.status === 'collected' ? reservation.payment_status ? "Payment Status: "  : "" + reservation.payment_status : 'block';
        modal.style.display = 'block';
        });

    const collectBtn = card.querySelector('.bagButton');
    if(collectBtn){
        collectBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // to stop modal view opening
        
        reservations[index].status = 'collected';
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        past.appendChild(card); // moves card to past panel
        collectBtn.remove();
        });
    }
    });

    const span = document.getElementsByClassName('close')[0];
    const modal = document.getElementById('myModal');

    span.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; }

    document.getElementById('modal-collect').addEventListener('click', () => {
    reservations[selectedIndex].status = 'collected';
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    modal.style.display = 'none';
    location.reload(); //  re-render the cards
    });
//}

/**
 * id             SERIAL PRIMARY KEY,
    user_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bag_id         INT NOT NULL REFERENCES bags(id),
    status         VARCHAR(20) NOT NULL DEFAULT 'reserved',
    transaction_id VARCHAR(50),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'paid',
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('reserved', 'collected', 'cancelled')),
    CHECK (payment_status IN ('paid', 'failed', 'refunded'))
 */