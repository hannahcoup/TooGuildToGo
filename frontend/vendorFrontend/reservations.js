async function loadReservations() {
    const upcoming = document.getElementById('upcoming');
    const past = document.getElementById('past');

    
    const vendor_id = localStorage.getItem('vendor_id');
    const res = await fetch(`https://tooguildtogo.onrender.com/reservations?vendor_id=${vendor_id}`);
    const reservations = await res.json();
    

    let selectedIndex = null;

    /**
     * Each bag consists of: name, category, description, price, collection time, and a status 
     * for each bag a card is created and appended to the upcoming
     *  or past section depending on their status. 
     * clicking on a bag opens a modal view which provides more detail on a bag such as a longer description and allergens
     * +to do - get upcoming bags sorted by time 
     */
    reservations.sort((a, b) => a.pickup_window_start.localeCompare(b.pickup_window_start));
    //sorts bags by time of collection
    reservations.forEach((reservation, index) => {
    const card = document.createElement('div');
    console.log(reservation);

    const shortDesc = reservation.description && reservation.description.length > 30 ? reservation.description.substring(0, 30) + '...' : reservation.description
    card.className = 'bag-card';
    card.innerHTML = `
        <h3>${reservation.user_name}</h3> 
        <p>${shortDesc || "No Description"}</p>
        <p>Discounted Price: £${reservation.discounted_price}</p>
        <p>Collection Window: ${formatDateTime(reservation.pickup_window_start) || "TBD"} - ${formatDateTime(reservation.pickup_window_end) || "TBD"}</p>
        
        
    `;
        if (reservation.reservation.status === 'collected') {
        past.appendChild(card);  // already collected goes to past
    } else if(reservation.payment_status === 'paid'){
        upcoming.appendChild(card);  // everything else goes to upcoming
    }


    //modal view shown when reservation clicked
    card.addEventListener('click', async () => {
        selectedIndex = index;
        const modal = document.getElementById('myModal');
        document.getElementById('modal-name').textContent = reservation.product_name;
        document.getElementById('modal-desc').textContent = reservation.description || "No Description";
        document.getElementById('modal-discounted_price').textContent = 'Price : £' + reservation.discounted_price;
        document.getElementById('modal-pickup_window_start').textContent =
            "Pickup Window start time: " + formatDateTime(reservation.pickup_window_start);
        document.getElementById('modal-pickup_window_end').textContent =
            "Pickup Window end time: " + formatDateTime(reservation.pickup_window_end);

        //fetches allergens for the bag and filters where contains= true 
        let allergensTEXT = "Unavailable";

        try {
            const allergenbag = await fetch(`https://tooguildtogo.onrender.com/bags/${reservation.bag_id}/allergens`);
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
            console.error("Allergen fetch failed:", e);
        }
        document.getElementById('modal-allergens').textContent = allergensText;
       

        //fetches all dietary tags in the reservation
        const dietaryRes = await fetch(`https://tooguildtogo.onrender.com/bags/${reservation.bag_id}/dietary_tags`);
        const dietaryTags = await dietaryRes.json();
        document.getElementById('modal-dietary').textContent =
            dietaryTags.length > 0 ? dietaryTags.map(d => d.name).join(', ') : 'None';
        
        modal.style.display = 'block';
    });
        

    const collectBtn = card.querySelector('.bagButton');
    if(collectBtn){
        collectBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); // to stop modal view opening
            
            reservations[index].status = 'collected';
            const res = await fetch(`https://tooguildtogo.onrender.com/reservations/${reservation.reservation_id}`, {
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
        document.getElementById('confirm-student').textContent = 'Student: ' + reservation.user_name;
        document.getElementById('confirm-bag').textContent = 'Bag: ' + reservation.product_name;
        document.getElementById('confirm-price').textContent = 'Amount to collect: £' + reservation.discounted_price;
        modal.style.display = 'none';
        confirmModal.style.display = 'block';
    });

    //confirm button in confirmModal updates database to change payment status and status
    document.getElementById('confirm-yes').addEventListener('click', async () => {
        const reservation = reservations[selectedIndex];

        const payRes = await fetch("https://tooguildtogo.onrender.com/vendor/mark-payment-collected", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                vendor_id: parseInt(vendor_id),
                reservation_id: reservation.reservation_id
            })
        });
        const payData = await payRes.json();
        
        if (payData.error) {
            alert(payData.error);
            return;
        }

        // then mark collected
        const colRes = await fetch("https://tooguildtogo.onrender.com/vendor/mark-collected", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                vendor_id: parseInt(vendor_id),
                reservation_id: reservation.reservation_id
            })
        });
        const colData = await colRes.json();

        if (colData.error) {
            alert(colData.error);
            return;
        }


        confirmModal.style.display = 'none';
        location.reload();
    });

}

loadReservations();


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
