async function loadReservations() {
    const upcoming = document.getElementById('upcoming');
    const past = document.getElementById('past');

    const allergenNames = {
    1: 'Celery', 2: 'Gluten', 3: 'Crustaceans', 4: 'Eggs',
    5: 'Fish', 6: 'Lupin', 7: 'Milk', 8: 'Molluscs',
    9: 'Mustard', 10: 'Nuts', 11: 'Peanuts', 12: 'Sesame',
    13: 'Soya', 14: 'Sulphites'
    };
    const vendor_id = localStorage.getItem('vendor_id');
    const res = await fetch(`http://127.0.0.1:8000/reservations?vendor_id=${vendor_id}`);
    const reservations = await res.json();
    

    let selectedIndex = null;

    /**
     * Each bag consists of: name, category, description, price, collection time, and a status 
     * for each bag a card is created and appended to the upcoming
     *  or past section depending on their status. 
     * clicking on a bag opens a modal view which provides more detail on a bag such as a longer description and allergens
     * +to do - get upcoming bags sorted by time - need to have CUSTOMER name aswell???
     */
    reservations.sort((a, b) => a.pickup_window_start.localeCompare(b.pickup_window_start));
    //sorts bags by time of collection
    reservations.forEach((reservation, index) => {
    const card = document.createElement('div');
    

    const shortDesc = reservation.description && reservation.description.length > 30 ? reservation.description.substring(0, 30) + '...' : reservation.description
    card.className = 'bag-card';
    card.innerHTML = `
        <h3>${reservation.student_name}</h3> 
        <p>${shortDesc || "No Description"}</p>
        <p>Discounted Price: £${reservation.discounted_price}</p>
        <p>Collection Window: ${reservation.pickup_window_start || "TBD"} - ${reservation.pickup_window_end || "TBD"}</p>
        <p><span style="font-style:italic">Reserved </span><p>
        <span style="color:${reservation.payment_status === 'paid' ? 'green' : 'orange'}">${reservation.payment_status}</span>
        
    `;
        if (reservation.status === 'collected') {
        past.appendChild(card);  // already collected goes to past
    } else {
        upcoming.appendChild(card);  // everything else goes to upcoming
    }


    //modal view shown when reservation clicked
    card.addEventListener('click', () => {
        selectedIndex = index;
        const modal = document.getElementById('myModal');
        document.getElementById('modal-name').textContent = reservation.product_name;
        document.getElementById('modal-desc').textContent = reservation.description || "No Description";
        document.getElementById('modal-discounted_price').textContent = 'Price : £' + reservation.discounted_price;
        document.getElementById('modal-pickup_window_start').textContent = "Pickup Window start time: " + reservation.pickup_window_start;
        document.getElementById('modal-pickup_window_end').textContent = "Pickup Window end time: " + reservation.pickup_window_end;

        document.getElementById('modal-allergens').textContent = 'N/A — coming soon';
        document.getElementById('modal-dietary').textContent = 'N/A — coming soon';

        //document.getElementById('modal-dietary').textContent = dietary.length > 0 ? dietary.join(', ') : 'None';
        //document.getElementById('modal-collect').style.display = reservation.status === 'collected' ? 'none' : 'block';
        //document.getElementById('modal-payment_status').style.display = reservation.status === 'collected' ? reservation.payment_status ? "Payment Status: "  : "" + reservation.payment_status : 'block';
        modal.style.display = 'block';
        });

    const collectBtn = card.querySelector('.bagButton');
    if(collectBtn){
        collectBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); // to stop modal view opening
            
            reservations[index].status = 'collected';
            const res = await fetch(`http://127.0.0.1:8000/reservations/${reservation.reservation_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'collected' })
            });
            
            past.appendChild(card); // moves card to past panel
            collectBtn.remove();
        });
    }
    });

    //closing modal functions
    const span = document.getElementsByClassName('close')[0];
    const modal = document.getElementById('myModal');
    const confirmModal = document.getElementById('confirmModal');
    const cspan = document.getElementsByClassName('close')[1];
    span.onclick = () => modal.style.display = 'none';
    cspan.onclick = () => confirmModal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = 'none'; 
        if (e.target == confirmModal) confirmModal.style.display = 'none'; 
    }
    //confirm button in first modal opens confirm modal
    document.getElementById('modal-confirm').addEventListener('click', () => {
        const reservation = reservations[selectedIndex];
        document.getElementById('confirm-student').textContent = 'Student: ' + reservation.student_name;
        document.getElementById('confirm-bag').textContent = 'Bag: ' + reservation.product_name;
        document.getElementById('confirm-price').textContent = 'Amount to collect: £' + reservation.discounted_price;
        modal.style.display = 'none';
        confirmModal.style.display = 'block';
    });

    //confirm button in confirmModal updates database to change payment status and status
    document.getElementById('confirm-yes').addEventListener('click', async () => {
        const reservation = reservations[selectedIndex];

        //updates status to collected
        await fetch(`http://127.0.0.1:8000/reservations/${reservation.reservation_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'collected' })
        });

        //update payment status to paid
        await fetch(`http://127.0.0.1:8000/reservations/${reservation.reservation_id}/payment`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_status: 'paid' })
        });

        confirmModal.style.display = 'none';
        location.reload();
    });

}

loadReservations();

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